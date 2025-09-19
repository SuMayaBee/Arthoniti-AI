import React from "react";

interface IconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

export function KeyIcon({
  className = "w-6 h-6",
  color,
  style,
  size = 24,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${color}`}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
    >
      <path
        d="M21 2L19 4L17 2L19 0L21 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 10L9 12L7 10L9 8L11 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 8L5 10L3 8L5 6L7 8Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 10L19 12L17 10L19 8L21 10Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 18L11 20L9 18L11 16L13 18Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 16L5 18L3 16L5 14L7 16Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
