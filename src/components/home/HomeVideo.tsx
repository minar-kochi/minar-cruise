
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
        <source src={'https://utfs.io/f/ba37775d-f5ec-4efd-add1-44badaa8a7bf-6qfl7u.mp4'} type="video/mp4" />
      </video>
    </>
  );
};

export default HomeVideo;
