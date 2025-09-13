type RetryOptions = {
  maxRetries: number;
  delay: number; // in milliseconds
  backoff?: "linear" | "exponential";
  backoffMultiplier?: number;
  retryIf?: (error: any) => boolean; // Custom condition to determine if retry should happen
  onRetry?: (error: any, attempt: number) => void; // Callback on each retry
};

// Default retry options
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 2,
  delay: 500,
  backoff: "exponential",
  backoffMultiplier: 2,
  retryIf: () => true, // Retry on any error by default
  onRetry: (error, attempt) =>
    console.log(`Retry attempt ${attempt}:`, error.message),
};

// Generic retry function
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {},
): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (attempt === config.maxRetries || !config.retryIf!(error)) {
        throw error;
      }

      // Call retry callback
      config.onRetry!(error, attempt + 1);

      // Calculate delay with backoff
      let delay = config.delay;
      if (config.backoff === "exponential") {
        delay = config.delay * Math.pow(config.backoffMultiplier || 2, attempt);
      } else if (config.backoff === "linear") {
        delay = config.delay * (attempt + 1);
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Utility function to create a retry wrapper for any function
export function createRetryWrapper<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: Partial<RetryOptions> = {},
) {
  return async (...args: TArgs): Promise<TReturn> => {
    return withRetry(() => fn(...args), options);
  };
}
