"use client";

import { create, createStore } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";

// type ProductCartType =

export type TYourState = {
  YourStates: number
};

export type TYourActions = {
  exampleFunc : (value: string) => void
};

export type YourFullStateFunc = TYourState &TYourActions;

export const YourStoreName = createStore<YourFullStateFunc>()(
    (set,get) => ({
        YourStates: 0,
        exampleFunc: (value) => set((state) => {


            return {YourStates: state.YourStates++}
        })
    })
);

export const createYourStore = () => {
  return YourStoreName;
};