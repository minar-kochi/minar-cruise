"use client";

import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

interface IProductCarousalProvider {
  children: ReactNode;
}
type TCContext = {
  currentIndex: number;
  setIndex: Dispatch<SetStateAction<number>>;
};
export const ProductCarousalContext = createContext<TCContext>({
  currentIndex: 0,
  setIndex: () => {},
});

const ProductCarousalIndexProvider = ({
  children,
}: IProductCarousalProvider) => {
  const [currentIndex, setIndex] = useState(0);

  return (
    <div className="w-full  h-full">
      <ProductCarousalContext.Provider
        value={{
          currentIndex,
          setIndex,
        }}
      >
        {children}
      </ProductCarousalContext.Provider>
    </div>
  );
};

export default ProductCarousalIndexProvider;
