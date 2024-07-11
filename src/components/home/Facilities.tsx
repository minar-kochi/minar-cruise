import Image from "next/image";
import Bounded from "../elements/Bounded";
import { star, facilities } from "@/constants/home/landingData";

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
          <article className="flex justify-center flex-col my-20 space-y-4 px-2 mx-2">
            <div className="flex gap-4 font-bold text-2xl items-center">
              <Image src={star.url} alt="star" width={50} height={200} />
              <h3>{heading}</h3>
            </div>
            <div className="">
              <ul className="list-disc grid md:grid-cols-2 gap-3 gap-x-7 text-sm">
                {description.map((item, i) => (
                  <>
                    <li className="text-lg max-w-fit py-2" key={item+i}>
                      {item}
                    </li>
                  </>
                ))}
              </ul>
            </div>
          </article>
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

