import Image from "next/image";
import Bounded from "../elements/Bounded";
import { star, facilities } from "@/constants/home/landingData";
import { Dot } from "lucide-react";
// import wave from '.'
const Facilities = () => {
  const { heading, description } = facilities;
  return (
    <section className="">
      <Image
        src={"/assets/Wave.svg"}
        alt=""
        className="w-full max-h-20"
        width={1000}
        height={400}
      />

      <Bounded className="">
        <section className=" my-20 ">
          <article className="">
            <div className="flex gap-4 font-bold text-2xl items-center">
              <Image src={star.url} alt="star" width={50} height={200} />
              <h3>{heading}</h3>
            </div>

            <ul className="list-disc list-inside  md:grid-cols-2 grid leading-10 text-sm">
              {description.map((item, i) => (
                <>
                  <li className="" key={i}>
                    {item}
                  </li>
                </>
              ))}
            </ul>
          </article>
        </section>
      </Bounded>
      <Image
        src={"/assets/Wave.svg"}
        alt=""
        className="w-full max-h-20 rotate-180"
        width={1000}
        height={400}
      />
    </section>
  );
};

export default Facilities;

// https://cochincruiseline.com/wp-content/uploads/2021/09/bg-line.png)
