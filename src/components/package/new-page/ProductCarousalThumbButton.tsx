"use client";
import React, { useContext } from "react";
import { ProductCarousalContext } from "./ProductCarousalContextProvider";
import { cn } from "@/lib/utils";
type TProductCarousalThumbButton = {
  children: React.ReactNode;
  index: number;
  className?: string;
  CurrentIndexClass?: string;
};
const   ProductCarousalThumbButton = ({
  children,
  index,
  className,
  CurrentIndexClass = '',
}: TProductCarousalThumbButton) => {
  const { setIndex, currentIndex } = useContext(ProductCarousalContext);
  function handleChange(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ) {
    e.preventDefault();
    setIndex(index);
  }
  return (
    <button
      className={cn("embla__slide slider-product-thumb bg-black", className, {
        [CurrentIndexClass]: index === currentIndex,
      })}
      onClick={(e) => handleChange(e, index)}
    >
      {children}
    </button>
  );
};

export default ProductCarousalThumbButton;
