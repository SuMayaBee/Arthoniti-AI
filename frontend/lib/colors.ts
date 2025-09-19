// Global Color Configuration
// This file contains all color definitions for the BusinessAI application

export const colors = {
  primary: {
    50: "#f5ebfc",
    100: "#e1bff4",
    200: "#d2a1ef",
    300: "#be76e8",
    400: "#b15be4",
    500: "#9e32dd", // Main primary color
    600: "#902ec9",
    700: "#70249d",
    800: "#571c7e",
    900: "#42155d",
  },
  theme: {
    50: "#feffff",
    100: "#fdfdfe",
    200: "#fcfdfd",
    300: "#fbfcfc",
    400: "#fafbfc",
    500: "#f9fafb", // Updated to match screenshot
    600: "#e3e4e4",
    700: "#b1b2b2",
    800: "#898a8a",
    900: "#696969",
  },
  neutral: {
    50: "#f8f8f8",
    100: "#dee2e9",
    200: "#ced5de",
    300: "#b7c1cf",
    400: "#a9b5c6",
    500: "#94a3b8",
    600: "#8794a7",
    700: "#697483",
    800: "#515865",
    900: "#3e444d",
  },
  success: {
    50: "#edf7ee",
    100: "#c8e6c9",
    200: "#addaaf",
    300: "#87c98a",
    400: "#70bf73",
    500: "#4caf50",
    600: "#459f49",
    700: "#367c39",
    800: "#2a602c",
    900: "#204a22",
  },
  red: {
    50: "#fde8e8",
    100: "#f9b1b1",
    200: "#f78b8b",
    300: "#f35555",
    400: "#f13535",
    500: "#ed0202",
    600: "#d80202",
    700: "#a80101",
    800: "#820101",
    900: "#640101",
  },
  highlight: {
    50: "#fff5e6",
    100: "#ffdfb0",
    200: "#ffd08a",
    300: "#ffba54",
    400: "#ffad33",
    500: "#ff9800",
    600: "#e88a00",
    700: "#b56c00",
    800: "#8c5400",
    900: "#6b4000",
  },
} as const;

// Type definitions for better TypeScript support
export type ColorShade =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";
export type ColorCategory = keyof typeof colors;

// Utility functions
export const getColor = (
  category: ColorCategory,
  shade: ColorShade = "500"
): string => {
  return colors[category][shade];
};

export const getPrimaryColor = (shade: ColorShade = "500"): string => {
  return colors.primary[shade];
};

// Common color combinations
export const colorCombinations = {
  primary: {
    light: colors.primary[100],
    main: colors.primary[500],
    dark: colors.primary[700],
    contrast: "#ffffff",
  },
  success: {
    light: colors.success[100],
    main: colors.success[500],
    dark: colors.success[700],
    contrast: "#ffffff",
  },
  error: {
    light: colors.red[100],
    main: colors.red[500],
    dark: colors.red[700],
    contrast: "#ffffff",
  },
  warning: {
    light: colors.highlight[100],
    main: colors.highlight[500],
    dark: colors.highlight[700],
    contrast: "#ffffff",
  },
} as const;


