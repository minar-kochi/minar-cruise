import { IBorderOptions, IBordersOptions, UnderlineType } from "docx";

// Common underline types
export const DOCXunderlineTypes = {
  SINGLE: UnderlineType.SINGLE,
  DOUBLE: UnderlineType.DOUBLE,
  THICK: UnderlineType.THICK,
  DOTTED: UnderlineType.DOTTED,
  DASHED: UnderlineType.DASHEDHEAVY,
  DASH_DOT: UnderlineType.DASHDOTHEAVY,
  DASH_DOT_DOT: UnderlineType.DASHDOTDOTHEAVY,
  WAVE: UnderlineType.WAVE,
  WORDS: UnderlineType.WORDS, // Only underlines words, not spaces
};

// Common font sizes (remember: size is in half-points)
export const DOCXfontSizes = {
  small: 18, // 9pt
  normal: 22, // 11pt
  medium: 24, // 12pt
  large: 28, // 14pt
  xlarge: 36, // 18pt
  xxlarge: 48, // 24pt
  huge: 72, // 36pt
};

// Common colors (hex format without #)
export const DOCXcolors = {
  black: "000000",
  white: "FFFFFF",
  red: "FF0000",
  green: "00FF00",
  blue: "0000FF",
  yellow: "FFFF00",
  orange: "FFA500",
  purple: "800080",
  gray: "808080",
  darkGray: "404040",
};

// Highlight colors (predefined names)
export const DOCXhighlightColors = [
  "yellow",
  "green",
  "cyan",
  "magenta",
  "blue",
  "red",
  "darkBlue",
  "darkCyan",
  "darkGreen",
  "darkMagenta",
  "darkRed",
  "darkYellow",
  "darkGray",
  "lightGray",
  "black",
  "white",
];

// Draws a border around the element on document

export function createBorder() {
  const border: IBordersOptions = {
    top: {
      color: "auto",
      space: 1,
      size: 6,
      style: "dashed",
    },
    bottom: {
      color: "auto",
      space: 1,
      size: 6,
      style: "dashed",
    },
    left: {
      color: "auto",
      space: 1,
      size: 6,
      style: "dashed",
    },
    right: {
      color: "auto",
      space: 1,
      size: 6,
      style: "dashed",
    },
  };
  return border;
}

export function createTextRunBorder() {
  return {
    style: "double",
    color: "#B3B3B3",
    size: 25,
    space: 2,
  } as IBorderOptions;
}