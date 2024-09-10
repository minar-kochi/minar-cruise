"use client";

import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  StepBack,
  StepForward,
} from "lucide-react";
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
      align: "center",
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
      0;
    }
  }, [emblaApi]);

  const {
    nextBtnDisabled,
    onNextButtonClick,
    onPrevButtonClick,
    prevBtnDisabled,
  } = usePrevNextButtons(emblaApi);
  const data = useMemo(() => children, [children]);

  return (
    <section className="  mx-auto rounded-lg">
      <div className="embla__viewport py-10  overflow-hidden " ref={emblaRef}>
        <div className="embla__container flex gap-5 ">{data}</div>
        {/* <div className="">
          <button
            onClick={onNextButtonClick}
            className=" text-black  absolute right-0 top-1/2"
          >
            <div>
              <ChevronRight className="w-8 h-8 hover:scale-110 duration-300" />
            </div>
          </button>
          <button
            onClick={onPrevButtonClick}
            className=" text-black  absolute left-0 top-1/2"
          >
            <div>
              <ChevronLeft className="w-8 h-8 hover:scale-110 duration-300" />
            </div>
          </button>
        </div> */}
      </div>
    </section>
  );
};
