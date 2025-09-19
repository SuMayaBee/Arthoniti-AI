import React from "react";

interface HeartIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
  filled?: boolean;
}

export default function HeartIcon({
  className = "w-6 h-6",
  color,
  style,
  size = 24,
  filled = false,
}: HeartIconProps) {
  return (
    <svg
      className={`${className} ${color}`}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
