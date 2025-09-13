import type React from "react";

interface DetailRowProps {
  label: string;
  value: string | number;
  valueClassName?: string;
  className?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  valueClassName = "",
  className = "",
}) => {
  return (
    <div className={`flex items-start ${className}`}>
      <span className="font-semibold w-36 flex-shrink-0 text-gray-700">
        {label}
      </span>
      <span className="mx-3 text-gray-500">:</span>
      <span className={`break-all font-medium ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
};

export default DetailRow;