import { getPackagesForBlog } from "@/db/data/dto/package";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function PackagesInBlog() {
  const data = await getPackagesForBlog();
  if (!data) {
    return <div>Failed to load recent blog posts</div>;
  }
  return (
    <div className="ml-5">
      <h1 className="text-2xl font-bold ">Minar Cruise Packages</h1>
      <div className="mt-5">
        {data.map((item, i) => (
          <>
            <Link href={`/booking/${item.slug}`} key={i} className="flex gap-5">
              <Image
                src={item.packageImage[0].image.url}
                width={400}
                height={400}
                alt={item.title}
                className="w-[88px] h-[88px] object-cover rounded-xl"
              />
              <div className="flex flex-col gap-1 justify-center">
                <h2 className="font-bold hover:text-red-600">{item.title}</h2>
                <p className="text-muted-foreground">
                  From{" "}
                  <span className="font-normal text-red-600">
                    {`₹${item.adultPrice}`}
                  </span>{" "}
                </p>
              </div>
            </Link>
            <div
              className={cn(
                "h-[0.1px] rounded-r-full rounded-l-full my-4 w-full bg-gray-300",
                {
                  hidden: i === data.length - 1,
                },
              )}
            />
          </>
        ))}
      </div>
    </div>
  );
}
