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
    [Autoplay({ playOnInit: true, delay: 6000, jump: false })],
  );

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes());
      0;
    }
  }, [emblaApi]);

  const data = useMemo(() => children, [children]);

  return (
    <section className="mx-auto rounded-lg overflow-hidden">
      <div className="embla__viewport py-10  overflow-hidden " ref={emblaRef}>
        <div className="embla__container flex gap-5 ">{data}</div>
      </div>
    </section>
  );
};
