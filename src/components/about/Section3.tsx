import { choices, video } from "@/constants/about/about";

const Section3 = () => {
  return (
    <article className="my-16">
      <h3 className="font-semibold text-4xl text-center tracking-wider">
        {choices.heading}
      </h3>
      <div className="">
        {choices.description.map((item, i) => (
          <>
            <p
              className="text-sm text-slate-600 tracking-wider leading-8 py-5 text-center"
              key={i}
            >
              {item}
            </p>
          </>
        ))}
      </div>
      {/* // TODO: add optimized video here  */}
      {/* <video muted loop={true} >
        <source src={video.url} type='video/mp4'/>
      </video> */}
    </article>
  );
};

export default Section3;
