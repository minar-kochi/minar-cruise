// import SearchBarWrapper from "../searchbar/SearchBarWrapper";

import { landingData } from "@/constants/home/landingData";
import SearchBarWrapper from "../searchbar/SearchBarWrapper";

const HomeVideo = async () => {
  const { video } = landingData;
  return (
    <div className="relative ">
      <video
        className="pointer-events-none object-contain lg:object-cover lg:h-[calc(100vh-65px)] w-full "
        playsInline
        preload="none"
        muted
        poster={"/assets/minar_video_bg.JPEG"}
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
