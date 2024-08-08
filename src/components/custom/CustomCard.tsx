import { cn } from "@/lib/utils";
import { DetailedHTMLProps, HTMLAttributes } from "react";

interface ICustomCard {
  className?: string;
  label?: string;
  props?: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
}

export default function CustomCard({ label, className, ...rest }: ICustomCard) {
  return (
    <article
      className={cn(
        "group cursor-pointer rounded-lg hover:scale-105 duration-150 bg-gray-950  min-w-[320px] min-h-[350px] shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] m-8 flex justify-center items-center",
        className,
      )}
      {...rest.props}
    >
      <p className=" max-w-[200px] text-center tracking-wider leading-7 text-slate-300 font-semibold">
        <span className="relative inline-block">
          {label ? label : "Add label here"}
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-slate-300 transition-all duration-300 group-hover:w-full"></span>
        </span>
      </p>
    </article>
  );
}
