import type React from "react";

interface TermsAndConditionsSectionProps {
  terms: string[];
}

const TermsAndConditionsSection: React.FC<TermsAndConditionsSectionProps> = ({
  terms,
}) => {
  return (
    <div className="my-6 bg-gray-50 p-6 rounded-lg">
      <h2 className="font-bold text-sm md:text-base mb-4 text-gray-800 border-b border-gray-300 pb-2">
        Terms and Conditions
      </h2>
      <ul className="list-decimal list-inside space-y-2 text-xs md:text-sm text-gray-700 leading-relaxed">
        {terms.map((term, index) => (
          <li key={`${index}-${term}`} className="pl-2">
            {term}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TermsAndConditionsSection;