import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface BlogCardType {
  imgUrl: string;
  title: string;
  desc: string;
  link: string;
}

export default function BlogCard({ imgUrl, title, desc, link }: BlogCardType) {
  return (
    <Link href={link} className="">
      <div className="relative h-[600px] max-w-[450px] rounded-3xl flex flex-col bg-muted/20 shadow-2xl hover:cursor-pointer">
        <Image
          src={imgUrl}
          alt="ship"
          width={1920}
          height={1080}
          className="rounded-t-3xl object-cover h-[60%]"
        />
        <div className="h-[40%] w-full bottom-0 left-0 rounded-b-3xl p-5 flex flex-col gap-3">
          <h1 className=" text-xl font-bold">{title.toUpperCase()}</h1>
          <p className=" text-muted-foreground py-2 ">{desc}</p>
          <Button variant={"underline"} className="  w-fit ml-auto">
            Read More
          </Button>
        </div>
      </div>
    </Link>
  );
}
