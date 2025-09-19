import React from "react";

interface GlobeIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

export default function GlobeIcon({
  className = "w-6 h-6",
  color,
  style,
  size = 24,
}: GlobeIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${color}`}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
    >
      <path
        d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 2.05C13 2.05 16 6 16 12C16 18 13 21.95 13 21.95"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 21.95C11 21.95 8 18 8 12C8 6 11 2.05 11 2.05"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
