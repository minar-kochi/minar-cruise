// import SearchBarWrapper from "../searchbar/SearchBarWrapper";

import { landingData } from "@/constants/home/landingData";

const HomeVideo = async () => {
  const { video } = landingData;
  return (
    <div className="relative ">
      {/* <SearchBarWrapper className=" absolute bottom-0 w-full" /> */}
      <video
        className="pointer-events-none object-contain lg:object-cover lg:h-[calc(100vh-65px)] w-full "
        playsInline
        preload="none"
        muted
        autoPlay
        loop
        width={1920}
        height={1080}
      >
        <source src={video} type="video/mp4" />
      </video>
    </div>
  );
};

export default HomeVideo;
