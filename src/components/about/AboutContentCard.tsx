import Image from "next/image"
import Bounded from "../elements/Bounded"
import { images } from "@/constants/about/images"
const AboutContentCard = () => {
  return (
    <Bounded>
        <Image src={images.topView.url} alt={images.topView.alt} width={1920} height={1080} className=""/>
    </Bounded>
  )
}

export default AboutContentCard