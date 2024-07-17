
const SearchLabel = ({ label, placeholder }: {
    label: string
    placeholder?: string
}) => {
  return (
    <div className="flex flex-col  pl-8">
      <h5 className="text-xs font-semibold  text-left w-fit">{label}</h5>
      <input
        type="text"
        placeholder={placeholder}
        className="w-[200px]  bg-inherit placeholder:text-xs outline-none placeholder:text-gray-600"
      />
    </div>
    
  );
};

export default SearchLabel;
