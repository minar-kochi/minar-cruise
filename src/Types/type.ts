export type TGallery = {
  Text: {
    bannerHeading: string;
    bannerQuote: string;
    description: string;
  };
  bannerImages: {
    url: string;
    alt: string;
  }[];
  allImages: {
    url: string;
    alt: string;
  }[];
};

export const Galleries = [
  "family-gathering",
  "corporate-gathering",
  "celebration-gathering",
] as const;

export type TGalleries = (typeof Galleries)[number];