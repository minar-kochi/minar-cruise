import { cn } from "@/lib/utils";
import { TSearchValidator } from "@/lib/validators/SearchFilterValidator";
import { useForm, UseFormWatch } from "react-hook-form";

export const PassengerCount = ({
  className,
  watch,
}: {
  watch: UseFormWatch<TSearchValidator>;
  className?: string;
}) => {
  let count = watch();
  let totalSeat = count.adultCount + count.babyCount + count.childCount;
  return (
    <p className={cn("text-muted-foreground mx-auto my-auto ", className)}>
      {totalSeat}
    </p>
  );
};
