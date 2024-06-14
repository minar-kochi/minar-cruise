
const HomeVideo = () => {
  return (
    <>
      <video
        className="pointer-events-none object-cover h-[calc(100vh-80px)] w-full "
        playsInline
        preload="true"
        muted
        autoPlay
        loop
    
      >
        <source src={'https://cochincruiseline.com/wp-content/uploads/2023/01/MINAR-VIDEO-1.mp4'} type="video/mp4" />
      </video>
    </>
  );
};

export default HomeVideo;
