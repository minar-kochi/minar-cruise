import Image from "next/image";
import Bounded from "../elements/Bounded";
import { blogCard } from "@/constants/blog/blog";
import Link from "next/link";

interface BlogcardType {
  imgUrl: string;
  title: string;
  desc: string;
  link: string;
}

export default function BlogCard({ imgUrl, title, desc, link }: BlogcardType) {
  return (
    <div className="border-[1px] border-muted  max-w-[350px] rounded-xl flex flex-col ">
      <div className="h-1/2 max-h-[250px]">
        <Image
          src={imgUrl}
          alt="ship"
          width={400}
          height={300}
          className="overflow-hidden rounded-xl"
        />
      </div>
      <div className="h-1/2 px-7 pt-9 pb-6  rounded-t-3xl ">
        <h1 className="text-xl font-semibold py-2 hover:text-red-500 cursor-pointer">
          {title}
        </h1>
        <p className="text-muted-foreground py-2 text-sm">{desc}</p>
        <Link className="py-2 text-red-500 font-semibold text-sm" href={link}>
          READ MORE
        </Link>
      </div>
    </div>
  );
}
