"use client";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
// import {
//   MdOutlineKeyboardArrowLeft,
//   MdOutlineKeyboardArrowRight,
// } from "react-icons/md";

import ClassNames from "embla-carousel-class-names";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import AutoScroll from "embla-carousel-auto-scroll";
import { ProductCarousalContext } from "./ProductCarousalContextProvider";
import { NextButton, PrevButton, usePrevNextButtons } from "./EmbalaButton";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useDotButton } from "./embalaDotApi";
import toast from "react-hot-toast";

useEmblaCarousel.globalOptions = { loop: false };

Autoplay.globalOptions = { delay: 4000, playOnInit: true };

AutoScroll.globalOptions = {
  playOnInit: true,
  stopOnInteraction: false,
};

const ProductCarousalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      active: true,
      loop: false,
      align: "end",
      axis: "x",
      skipSnaps: false,
      containScroll: "trimSnaps",
    },
    // []
    // [AutoScroll({ playOnInit: true })],
  );
  const {
    onNextButtonClick,
    onPrevButtonClick,
    nextBtnDisabled,
    prevBtnDisabled,
  } = usePrevNextButtons(emblaApi);

  const { currentIndex, setIndex } = useContext(ProductCarousalContext);
  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("scroll", () => {
        setIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi, setIndex]);
  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(currentIndex);
    }
  }, [emblaApi, currentIndex]);

  // useEffect(() => {
  //   if (emblaApi) {
  //     emblaApi.scrollTo(currentIndex);
  //   }
  // }, [emblaApi, currentIndex]);

  const data = useMemo(() => children, [children]);
  return (
    <>
      <div className="relative group  w-full h-full">
        <div className="absolute  transition-all duration-700 ease-in-out h-full bottom-[50%] right-0 top-[50%] z-10 my-auto">
          <button
            onClick={() => {
              onNextButtonClick();

              setIndex((prev) => prev + 1);
            }}
            disabled={nextBtnDisabled}
            className={cn(
              "grid h-full w-8  group-hover:bg-white/40 bg-white/0 place-content-center place-items-center    ",
              { hidden: nextBtnDisabled },
            )}
          >
            <ArrowRightIcon
              className={cn("h-8 w-8 group-hover:opacity-100 opacity-0", {
                hidden: nextBtnDisabled,
              })}
            />
          </button>
        </div>
        <div className="absolute transition-all duration-700 ease-in-out h-full  bottom-[50%] left-0 top-[50%] z-10 my-auto">
          <button
            onClick={() => {
              onPrevButtonClick();

              setIndex((prev) => prev - 1);
            }}
            disabled={prevBtnDisabled}
            className={cn(
              "grid h-full w-8  group-hover:bg-white/40 bg-white/0 place-content-center place-items-center    ",
              { hidden: prevBtnDisabled },
            )}
          >
            <ArrowLeftIcon
              className={cn("h-8 w-8 group-hover:opacity-100 opacity-0", {
                hidden: prevBtnDisabled,
              })}
            />
          </button>
        </div>
        <div className="embla  relative  overflow-hidden h-full" ref={emblaRef}>
          <div className="embla__container   relative gap-2 h-full ">
            {data}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCarousalProvider;
