// Color utility functions for BusinessAI
import { colors } from "./colors";

/**
 * Converts a hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Converts RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Gets a color with opacity
 */
export function getColorWithOpacity(color: string, opacity: number): string {
  const rgb = hexToRgb(color);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Generates a gradient between two colors
 */
export function createGradient(
  fromColor: string,
  toColor: string,
  direction:
    | "to-r"
    | "to-br"
    | "to-b"
    | "to-bl"
    | "to-l"
    | "to-tl"
    | "to-t"
    | "to-tr" = "to-r"
): string {
  return `bg-gradient-${direction} from-[${fromColor}] to-[${toColor}]`;
}

/**
 * Gets the primary color with different shades
 */
export const primaryColors = {
  light: colors.primary[100],
  main: colors.primary[500],
  dark: colors.primary[700],
  background: colors.primary[50],
  text: colors.primary[900],
} as const;

/**
 * Common color combinations for the app
 */
export const appColors = {
  primary: primaryColors,
  success: {
    light: colors.success[100],
    main: colors.success[500],
    dark: colors.success[700],
  },
  error: {
    light: colors.red[100],
    main: colors.red[500],
    dark: colors.red[700],
  },
  warning: {
    light: colors.highlight[100],
    main: colors.highlight[500],
    dark: colors.highlight[700],
  },
} as const;

/**
 * Tailwind CSS classes for common color patterns
 */
export const colorClasses = {
  primary: {
    bg: "bg-primary-500",
    text: "text-primary-500",
    border: "border-primary-500",
    ring: "ring-primary-500",
    hover: "hover:bg-primary-600",
    focus: "focus:ring-primary-500",
  },
  success: {
    bg: "bg-success-500",
    text: "text-success-500",
    border: "border-success-500",
  },
  error: {
    bg: "bg-red-500",
    text: "text-red-500",
    border: "border-red-500",
  },
} as const;
