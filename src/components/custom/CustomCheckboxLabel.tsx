import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";


interface ICustomCheckboxLabel {
    label: string
    labelClassName?: string
    className?: string
    description?: string
    descriptionClassName?: string
}
export default function CustomCheckboxLabel({ label, description, className, descriptionClassName, labelClassName}:ICustomCheckboxLabel) {
  return (
    <div className={cn("items-top flex space-x-2", className)}>
      <Checkbox id="terms" required />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ", labelClassName)}
        >
          {label}
        </label>
        <p className={cn("text-sm text-muted-foreground", descriptionClassName)}>
            {description}
        </p>
      </div>
    </div>
  );
}

