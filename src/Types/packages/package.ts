import { getOrganizedPackages } from "@/db/data/dto/package";

/**
 * Raw Structure of Organized Packages.
 *  */
export type TRawOrganizedPackageData = typeof getOrganizedPackages;

/**
 * Serilized Structure of Organized Packages.
 *  */
export type TOrganizedPackageData = Awaited<
  ReturnType<TRawOrganizedPackageData>
>;

/**
 * Removed null and Pure Structure of Organized Package
 *  */

export type TExcludedOrganizedPackageData = Exclude<
  TOrganizedPackageData,
  null
>;
