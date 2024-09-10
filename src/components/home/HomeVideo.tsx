// import SearchBarWrapper from "../searchbar/SearchBarWrapper";

const HomeVideo = async () => {
  return (
    <div className="relative ">
      {/* <SearchBarWrapper className=" absolute bottom-0 w-full" /> */}
      <video
        className="pointer-events-none object-contain lg:object-cover lg:h-[calc(100vh-65px)] w-full "
        playsInline
        preload="true"
        muted
        autoPlay
        loop
        width={1920}
        height={1080}
      >
        <source src="/assets/HomeVid.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default HomeVideo;
