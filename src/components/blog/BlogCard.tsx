import Image from "next/image";
import Bounded from "../elements/Bounded";
import Link from "next/link";

interface BlogcardType {
  imgUrl: string;
  title: string;
  desc: string;
  link: string;
}

export default function BlogCard({ imgUrl, title, desc, link }: BlogcardType) {
  return (
    <div className="border-[1px] border-muted max-w-[350px] rounded-xl flex flex-col h-fit">
      <Link href={link} className="h-1/2 max-h-[250px]">
        <Image
          src={imgUrl ?? "/assets/world-map.png"}
          alt="ship"
          width={400}
          height={300}
          className="overflow-hidden rounded-xl"
        />
      </Link>
      <div className="h-1/2 px-7 pt-9 pb-6  rounded-t-3xl ">
        <Link
          href={link}
          className="text-xl font-semibold py-2 hover:text-red-500 cursor-pointer"
        >
          {title}
        </Link>
        <p className="text-muted-foreground py-2 text-base">{desc}</p>
        <Link className="py-2 text-red-500 font-semibold text-sm" href={link}>
          READ MORE
        </Link>
      </div>
    </div>
  );
}
