import { AllPackages } from "@/constants/packages/package";
import { cn } from "@/lib/utils";

const PackageDescription = ({ className }: { className?: string }) => {
  const { Sunset } = AllPackages;

  return (
    <summary className={cn("", className)}>
      <p>{Sunset.description}</p>
    </summary>
  );
};

export default PackageDescription;
