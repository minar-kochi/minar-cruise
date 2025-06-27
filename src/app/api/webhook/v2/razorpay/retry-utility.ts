function isRetryableError(error: any): boolean {
  if (!error) return false;

  const errorMessage = error.message?.toLowerCase() || "";
  const errorCode = error.code || "";

  // Database connection issues
  if (
    errorMessage.includes("connection") ||
    errorMessage.includes("timeout") ||
    errorMessage.includes("pool") ||
    errorMessage.includes("network")
  ) {
    return true;
  }

  // Prisma specific retryable errors
  if (
    errorCode === "P1017" || // Server has closed the connection
    errorCode === "P1008" || // Operations timed out
    errorCode === "P1001" || // Can't reach database server
    errorCode === "P1002"
  ) {
    // Database server connection timeout
    return true;
  }

  // Deadlock or lock timeout
  if (
    errorMessage.includes("deadlock") ||
    errorMessage.includes("lock timeout")
  ) {
    return true;
  }

  return false;
}

export async function executeTransactionWithRetry<T>(
  transactionFn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 1000,
    maxDelayMs = 10000,
    backoffMultiplier = 2,
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await transactionFn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Check if error is retryable
      if (!isRetryableError(error)) {
        console.error(`Non-retryable error on attempt ${attempt + 1}:`, error);
        throw error;
      }

      const delay = getRetryDelay(attempt, {
        maxRetries,
        baseDelayMs,
        maxDelayMs,
        backoffMultiplier,
      });

      console.warn(
        `Transaction failed on attempt ${attempt + 1}/${maxRetries + 1}. ` +
          `Retrying in ${delay}ms...`,
        { error: error?.message, code: error?.code },
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // If we get here, all retries failed
  console.error(
    `Transaction failed after ${maxRetries + 1} attempts:`,
    lastError,
  );
  throw lastError;
}

type RetryOptions = {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
};
function getRetryDelay(
  attempt: number,
  options: Required<RetryOptions>,
): number {
  const { baseDelayMs, maxDelayMs, backoffMultiplier } = options;
  const exponentialDelay = Math.min(
    baseDelayMs * Math.pow(backoffMultiplier, attempt),
    maxDelayMs,
  );
  // Add jitter (±25% random variation)
  const jitter = exponentialDelay * 0.25 * (Math.random() - 0.5);
  return Math.floor(exponentialDelay + jitter);
}
