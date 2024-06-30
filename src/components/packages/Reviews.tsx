import { RatingMock } from "@/constants/mock";
import Bounded from "../elements/Bounded";

const Reviews = () => {
  return (
    <Bounded>
      <div className="py-20 ">
        <h3 className="border-l-2  border-red-400 px-3 font-bold text-xl">
          Review Score
        </h3>
        <div className="mt-5 border border-gray-300 h-[300px] rounded-md flex ">
          <div className="basis-[40%] border-r border-gray-300 grid place-content-center text-center ">
            <h1 className="text-7xl">
              4.5<span className="text-2xl text-muted-foreground">/5</span>
            </h1>
            <h5 className="text-xl font-semibold text-red-400">Very Good</h5>
            <p className="text-muted-foreground text-base">1 verified review</p>
          </div>
          <div className="p-8 basis-[60%]">
            <ul className="flex flex-col justify-between h-full">
              {RatingMock.map(({rating,title}, i ) => (
                <li className="pt-1 first-of-type:pt-0 " key={`${rating}-${title}-${i}`}>
                  <div className="flex justify-between ">
                    <div className="">{title}</div>
                    <div className="">{rating}/5</div>
                  </div>
                  <div style={{
                    width: `${rating * 2 * 10}%`
                  }} className="h-3 mt-1 bg-orange-200 rounded-full">

                  </div>
                </li>
              ))}

              {/* <li className="border">location</li>
                        <li className="border">Amenities</li>
                        <li className="border">Services</li>
                        <li className="border">Price</li> */}
            </ul>
          </div>
        </div>
      </div>
    </Bounded>
  );
};

export default Reviews;
