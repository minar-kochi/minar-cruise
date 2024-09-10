"use client";
import React, { useContext } from "react";
import { FaArrowRight } from "react-icons/fa";
import { ProductCarousalContext } from "./ProductCarousalContextProvider";

const ProductRotateButton = ({
  action,
  index,
}: {
  action: "NEXT" | "PREV";
  index: number;
}) => {
  const {} = useContext(ProductCarousalContext);
  function handleRotation(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    action: "NEXT" | "PREV",
  ) {
    if (action === "NEXT") {
      //do Next action.

      return;
    }

    //do previous action
  }

  return (
    <button onClick={(e) => handleRotation(e, action)}>
      <FaArrowRight />
    </button>
  );
};

export default ProductRotateButton;
