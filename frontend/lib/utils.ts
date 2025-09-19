import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if user is authenticated on the client side
 */
export function isAuthenticated(): boolean {
  if (typeof document === "undefined") return false;
  return !!getCookie('access_token');
}

/**
 * Set a cookie with the given name, value, and options
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
  } = {}
) {
  if (typeof document === "undefined") return;

  const {
    expires, // Don't set default expiration for session cookies
    path = "/",
    domain,
    secure = true,
    sameSite = "strict",
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  // Only add expires if provided (for session cookies, don't set expiration)
  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += "; secure";
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(
  name: string,
  options: {
    path?: string;
    domain?: string;
  } = {}
) {
  if (typeof document === "undefined") return;

  const { path = "/", domain } = options;

  let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  document.cookie = cookieString;
}

/**
 * Handles image URLs from different sources
 * @param url The image URL from the API response
 * @returns The processed URL that can be used in the frontend
 */
export function processImageUrl(url: unknown): string {
  if (!url || typeof url !== "string") return "";

  // Absolute URL -> return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Prefer API base for assets coming from backend
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
  const appBase = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

  const base = apiBase || appBase || (typeof window !== "undefined" ? window.location.origin : "");

  if (!base) return url;

  if (url.startsWith("/")) {
    return `${base}${url}`;
  }

  return `${base}/${url}`;
}

/**
 * Checks if a URL is from an external source (not our backend)
 */
export function isExternalUrl(url: string): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (baseUrl) {
      const baseUrlObj = new URL(baseUrl);
      return urlObj.hostname !== baseUrlObj.hostname;
    }

    // If no base URL is set, assume external if it's a full URL
    return url.startsWith("http://") || url.startsWith("https://");
  } catch {
    return false;
  }
}

// Constants for chat title generation
const LINE_BREAK_REGEX = /\r?\n/;
const MARKDOWN_MARKERS_REGEX = /[*_`#]+/g;
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\([^)]+\)/g;
const MARKDOWN_IMAGE_REGEX = /!\[([^\]]*)\]\([^)]+\)/g;
const WHITESPACE_REGEX = /\s+/g;

/**
 * Generates a chat title from the user's message
 * Takes the first line or first 50 characters, whichever is shorter
 * Removes markdown and special characters for a clean title
 */
export function generateChatTitle(message: string): string {
  if (!message || typeof message !== "string") {
    return "New Chat";
  }

  // Trim whitespace
  const cleaned = message.trim();
  
  if (!cleaned) {
    return "New Chat";
  }

  // Take first line only (split by line breaks)
  const firstLine = cleaned.split(LINE_BREAK_REGEX)[0]?.trim() || "";
  
  if (!firstLine) {
    return "New Chat";
  }

  // Remove markdown syntax (basic cleanup)
  let title = firstLine
    .replace(MARKDOWN_MARKERS_REGEX, "") // Remove markdown markers
    .replace(MARKDOWN_LINK_REGEX, "$1") // Convert [text](url) to text
    .replace(MARKDOWN_IMAGE_REGEX, "") // Remove image markdown
    .replace(WHITESPACE_REGEX, " ") // Normalize whitespace
    .trim();

  // Truncate to reasonable length
  const maxLength = 50;
  const wordBoundaryThreshold = 0.7;
  
  if (title.length > maxLength) {
    title = title.substring(0, maxLength).trim();
    // Try to end at a word boundary if possible
    const lastSpaceIndex = title.lastIndexOf(" ");
    if (lastSpaceIndex > maxLength * wordBoundaryThreshold) {
      title = title.substring(0, lastSpaceIndex);
    }
    title += "...";
  }

  // Fallback if title becomes empty after cleaning
  return title || "New Chat";
}
