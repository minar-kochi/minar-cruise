export interface IIterateTable {
  tables?: TdbSchema[];
}
export type TdbSchema =
  | "package"
  | "amenities"
  | "booking"
  | "foodMenu"
  | "image"
  | "schedule"
  | "user"
  | "packageImage"

export const dbSchema: TdbSchema[] = [
  "package",
  "amenities",
  "booking",
  "foodMenu",
  "image",
  "schedule",
  "user",
  "packageImage"
];
