import React from "react";

interface SpeakerWaveIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function SpeakerWaveIcon({ size = 24, color = "currentColor", className = "" }: SpeakerWaveIconProps) {
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
        d="M11 5L6 9H2V15H6L11 19V5Z"
        fill={color}
      />
      <path
        d="M15.54 8.46C16.4774 9.39764 17.0039 10.7538 17.0039 12.18C17.0039 13.6062 16.4774 14.9624 15.54 15.9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
