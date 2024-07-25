"use client";

import { create, createStore } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";

export type ProductCartType = {
  id: string;
};

export type Wheel = (
  data: ProductCartType[] | ((prev: ProductCartType[]) => ProductCartType[])
) => void;

export type TYourState = {
  YourStates: number;
  product: ProductCartType[];
};

export type TYourActions = {
  exampleFunc: (value: string) => void;
  setProduct: Wheel;
};

export type YourFullStateFunc = TYourState & TYourActions;

export const YourStoreName = createStore<YourFullStateFunc>()((set, get) => ({
  YourStates: 0,
  product: [],
  setProduct: (prod) =>
    set((state) => ({
      product: typeof prod === "function" ? [...prod(state.product)] : prod,
    })),
  exampleFunc: (value) =>
    set((state) => {
      return { YourStates: state.YourStates++ };
    }),
}));

export const createYourStore = () => {
  return YourStoreName;
};
