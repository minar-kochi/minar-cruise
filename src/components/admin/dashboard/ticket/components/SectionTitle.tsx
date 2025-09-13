import type React from "react";

interface SectionTitleProps {
  title: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  className = "",
}) => {
  return (
    <h2 className={`text-lg md:text-xl font-bold text-center mb-6 md:mb-8 text-gray-800 relative ${className}`}>
      <span className="bg-white px-4 relative z-10">{title}</span>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
    </h2>
  );
};

export default SectionTitle;