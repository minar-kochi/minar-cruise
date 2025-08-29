import { Checkbox } from "@/components/ui/checkbox";
import { TGetPackageSearchItems } from "@/db/data/dto/package";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import { useClientDispatch } from "@/hooks/clientStore/clientReducers";
import { isSelectedPackage } from "@/lib/features/client/packageClientSelectors";
import { setSelectedPackage } from "@/lib/features/client/packageClientSlice";
import { cn, formatPrice } from "@/lib/utils";
import { Baby, Check, User } from "lucide-react";
import Image from "next/image";
type TPackageSelectCard = {
  item: TGetPackageSearchItems[number];
};
export default function PackageSelectCard({ item }: TPackageSelectCard) {
  const selected = useAppSelector((state) => isSelectedPackage(state, item.id));
  const dispatch = useClientDispatch();
  return (
    <button
      onClick={() => {
        dispatch(setSelectedPackage(item));
      }}
      className={cn(
        "flex group bg-white  pr-4  md:pr-5 hover:bg-foreground/5 gap-3 flex-shrink-0   border-muted rounded-lg  w-full overflow-hidden",
        // {
        //   "bg-blue-100": selected.selected,
        // },
      )}
    >
      <div className="">
        <Image
          className="max-w-32 max-h-24 object-cover"
          alt={item?.packageImage?.[0]?.image?.alt ?? ""}
          src={item?.packageImage?.[0]?.image?.url || "/fallback-image.jpg"}
          width={420}
          height={550}
        />
      </div>
      <div className="flex items-center justify-center w-full">
        <div className="w-full pr-4 pt-2 flex flex-col  items-start ">
          <h4 className="font-medium line-clamp-1  text-sm text-start text-pretty">
            {item.title}
          </h4>
          <p className="text-sm text-primary">
            {formatTiming(item.fromTime)} <span className="text-black">~</span>{" "}
            {formatTiming(item.toTime)}
          </p>
          <div className="mt-2 text-sm md:bg-primary/10 flex w-max md:px-2 py-1.5 rounded-md">
            <p className="text-primary gap-2 flex items-center justify-center ">
              <span className="flex gap-1 border-r pr-2 items-center">
                {<User size={16} />} ₹{formatPrice(item.adultPrice)}/-
              </span>
              <span className="flex gap-1 items-center">
                {<Baby size={16} />} ₹{formatPrice(item.adultPrice)}/-
              </span>
            </p>
          </div>
        </div>
        <div className="w-5 h-5 border flex border-primary items-center justify-center rounded-md">
          {selected.selected ? (
            <Check className="w-4 h-4 text-primary " />
          ) : null}
        </div>
        {/* <Checkbox type="" id={`${selected.index}`} checked={selected.selected} /> */}
      </div>
    </button>
  );
}

export function formatTiming(value: string): string {
  return value.replaceAll(":", ".").toLocaleLowerCase();
}
