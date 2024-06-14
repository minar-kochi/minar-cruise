import { BookingData } from "@/constants/home/landingData"
import Bounded from "../elements/Bounded"
import Image from "next/image"

const BookingDescription = () => {
    const { image,mainHeading,subHeading } = BookingData
  return (
    <Bounded>
        <section>
            <Image width={500} height={500} src={image.url} alt={image.alt}/>
        </section>
    </Bounded>
  )
}

export default BookingDescription