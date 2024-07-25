import { cn } from "@/lib/utils";

const SearchLabel = ({
  label,
  data,
  className,
}: {
  label: string;
  data?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn("flex flex-col px-8 text-left w-full max-sm:px-4 ", className)}
    >
      <h5 className=" text-xs font-semibold  ">{label}</h5>
      <p className=" bg-inherit md:text-xs text-[0.6rem] outline-none text-gray-600 overflow-hidden">{data}</p>
    </div>
  );
};

export default SearchLabel;
