import { cn } from "@/lib/utils"

interface InputProps {
    label: string
    placeholder?: string
    required?: boolean 
}

const InputBox = ({ label, placeholder, required }: InputProps ) => {
  return (
    <div className={cn("flex flex-col gap-3 py-5")}>
        <label htmlFor="" className="text-slate-500 text-sm">{label}</label>
        <input type="text" className="w-full h-10 bg-gray-200 hover:bg-gray-300" placeholder={placeholder} />
    </div>
  )
}

export default InputBox