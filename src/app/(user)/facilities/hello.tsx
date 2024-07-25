"use client";
import { useProductStore } from "@/providers/name-store-provider";
import { ProductCartType } from "@/stores/filter-booking-store";
import React from "react";

function Hello() {
  const setProduct = useProductStore((state) => state.setProduct);
  const Products = useProductStore((state) => state.product);

  let prevs: ProductCartType[] = [{ id: "hdahsd" }];

  return (
    <div>
      {JSON.stringify(Products)}
      <button onClick={() => setProduct((prev) => [...prev, ...prevs])}>
        Add
      </button>
    </div>
  );
}

export default Hello;
