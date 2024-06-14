import Bounded from "../elements/Bounded"
import Image from "next/image"
import { landingData } from "@/constants/home/landingData"
import { Montserrat } from 'next/font/google'
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
// TODO: Home-> Landing page Image shitty Round animated circles.

const mont = Montserrat({
    weight: [ "400", "700"],
    style: "normal",
    subsets: ["cyrillic"]
})

const LandingDescription = () => {
    const {description,heading,image,title} = landingData
    console.log(mont.className)
  return (
    <Bounded className="flex mt-12 justify-evenly items-center py-32">
        <section className="max-w-lg flex flex-col gap-7">
            <p className="text-sm text-red-500 font-semibold">{heading}</p>
            <h1 className={cn("border-l-4 border-l-red-500 pl-4 text-4xl font-[Montserrat,sans-serif] font-bold ", mont.className)}>{title}</h1>
            <p className="font-sans tracking-wide leading-7">{description}</p>
            <Button>Read Me</Button>
        </section>
        <section className="p-2 " >
            <div className="overflow-hidden rounded-full">
                <Image width={500} height={500} src={image.url} alt={image.url} />
            </div>
        </section>
    </Bounded>
  )
}

export default LandingDescription