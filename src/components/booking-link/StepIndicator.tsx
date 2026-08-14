import { cn } from "@/lib/utils";

const TOTAL_STEPS = 2;

export function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-center text-xs font-medium text-muted-foreground">
        Step {step} of {TOTAL_STEPS}
      </p>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={step}
        aria-label={`Step ${step} of ${TOTAL_STEPS}`}
      >
        <div
          className={cn(
            "h-full rounded-full bg-primary transition-all duration-500",
            step === 1 ? "w-1/2" : "w-full",
          )}
        />
      </div>
    </div>
  );
}
