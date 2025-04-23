import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { truncateText } from "@/lib/utils";

interface BlogCardType {
  imgUrl: string;
  title: string;
  desc: string;
  link: string;
}

export default function BlogCard({ imgUrl, title, desc, link }: BlogCardType) {
  
  return (
    <Link href={link} className="justify-self-center">
      <div className="relative h-[500px] w-[390px] rounded-xl flex flex-col bg-muted/20 shadow-2xl hover:cursor-pointer">
        <Image
          src={imgUrl}
          alt="ship"
          width={1920}
          height={1080}
          className="rounded-t-xl object-cover h-[60%]"
        />
        <div className="h-[40%] w-full rounded-b-xl flex flex-col px-4 py-2">
          <div className="space-y-1">
            <h1 className="  text-xl font-bold">{truncateText(title,35).toUpperCase()}</h1>
            <p className="  text-muted-foreground">{truncateText(desc,70)}</p>
          </div>
          <Button variant={"underline"} className="w-fit ml-auto py-0 ">
            Read More
          </Button>

        </div>
      </div>
    </Link>
  );
}
