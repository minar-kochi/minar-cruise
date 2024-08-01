"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo } from "react";
import { usePrevNextButtons } from "./EmblaButton";
import Autoplay from "embla-carousel-autoplay";

export const EmblaCarouselProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      active: true,
      loop: true,
      dragFree: true,
      startIndex: 1,
    },
    [Autoplay({ playOnInit: true, delay: 3000 })],
  );

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes());
    }
  }, [emblaApi]);

  // const {
  //   nextBtnDisabled,
  //   onNextButtonClick,
  //   onPrevButtonClick,
  //   prevBtnDisabled,
  // } = usePrevNextButtons(emblaApi);
  const data = useMemo(() => children, [children]);

  return (
    <div className="relative">
      <div className="embla py-10 relative" ref={emblaRef}>
        <div className="embla__container relative gap-5 ">{data}</div>
        {/* <div className=" flex justify-center">
          <button onClick={onNextButtonClick} className="h-full bg-red-600 text-white">
            next
          </button>
          <button onClick={onPrevButtonClick} className="h-full bg-red-600 text-white">
            back
          </button>
        </div> */}
      </div>
    </div>
  );
};
