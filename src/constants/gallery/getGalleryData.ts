import { TGalleries, TGallery } from "@/Types/type";

import {
  celebrationGathering,
  corporateGathering,
  familyGathering,
} from "@/constants/gallery/gallery";

export const getGallery = (slug: TGalleries): TGallery => {
  if (slug === "celebration-gathering") {
    return celebrationGathering;
  }
  if (slug === "corporate-gathering") {
    return corporateGathering;
  }
  return familyGathering;
};
