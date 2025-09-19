import React from "react";

interface PauseIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function PauseIcon({ size = 24, color = "currentColor", className = "" }: PauseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z"
        fill={color}
      />
    </svg>
  );
}
