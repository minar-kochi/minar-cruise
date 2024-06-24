import Image from "next/image";
import { entertainment } from "@/constants/home/landingData";
import { Bad_Script } from 'next/font/google'
import { cn } from "@/lib/utils";

const badScript = Bad_Script({
    weight: "400",
    style: ["normal"],
    subsets: ["latin"]
}) 
const Entertainments = () => {
  const { image } = entertainment;
  return (
    <section className="flex">
      <article className="max-sm:hidden basis-[50%] object-bottom">
        <Image src={image.url} alt="" width={1920} height={1080} className="min-w-full min-h-full object-cover" />
      </article>
      <article className="p-5 max-sm:basis-full basis-[50%] w-full bg-red-600 text-white">
        <div className="max-w-fit">
            <h1 className="text-5xl font-bold py-8 overflow-hidden">Entertainments</h1>
            <ul className={cn("text-2xl list-disc list-inside space-y-5", badScript.className)}>
                <li>Live DJ performance</li>
                <li>Live Karaoke singers</li>
                <li>Mimicry show</li>
                <li>Magic Show</li>
                <li>Fun filled programs</li>
            </ul>
        </div>
      </article>
    </section>
  );
};

export default Entertainments;
