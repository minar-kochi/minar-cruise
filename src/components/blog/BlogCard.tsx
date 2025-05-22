import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, User } from "lucide-react";
import { format } from "date-fns";

interface BlogCardType {
  imgUrl: string;
  title: string;
  desc: string;
  link: string;
  date: string;
  author: string;
}

export default function BlogCard({
  imgUrl,
  title,
  desc,
  link,
  date,
  author,
}: BlogCardType) {
  return (
    <Link
      href={link}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-md"
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imgUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Category Badge - You can add this if needed */}
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800 backdrop-blur-sm">
          Blog
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {format(date, "MMM yyyy")}
          </span>
          {/* <span className="text-xs text-gray-500">5 min read</span> */}
        </div>

        <h3 className="mb-3 text-lg font-bold tracking-tight text-gray-900 line-clamp-2">
          {title}
        </h3>

        <p className="mb-6 text-sm text-gray-600 line-clamp-2">{desc}</p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100">
              <User size={20} className="text-gray-500" />
            </div>
            <span className="text-xs font-medium text-gray-700">{author}</span>
          </div>

          <div className="flex items-center text-sm font-medium text-blue-600 transition-all group-hover:pr-1">
            Read
            <ArrowUpRight className="ml-1 h-4 w-4 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
