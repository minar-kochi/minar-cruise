import React, { Suspense } from "react";
import ProductCard from "../Home/ProductCard";
import { ProductData } from "@/locales/en/data/ProductData";
import { cn } from "@/lib/utils";

interface IProductsCards {
    className?:string
}

function ProductsCards({className}:IProductsCards) {
  return (
    <div className={cn("mt-32",className)}>
      <div className="flex w-full flex-wrap items-center justify-center gap-6 md:gap-9 ">
        <Suspense>
          {ProductData.map((item, i) => {
            return <ProductCard key={`${item.id}-${i}`} {...item} />;
          })}
        </Suspense>
      </div>
    </div>
  );
}

export default ProductsCards;
