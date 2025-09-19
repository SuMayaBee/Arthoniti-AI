import React from "react";

interface PlayIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function PlayIcon({ size = 24, color = "currentColor", className = "" }: PlayIconProps) {
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
        d="M8 5V19L19 12L8 5Z"
        fill={color}
      />
    </svg>
  );
}
