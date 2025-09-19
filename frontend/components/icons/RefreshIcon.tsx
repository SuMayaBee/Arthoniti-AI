import React from "react";

interface RefreshIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

export default function RefreshIcon({
  className = "w-6 h-6",
  color,
  style,
  size = 24,
}: RefreshIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${color}`}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
    >
      <path
        d="M1 4V10H7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 20V14H17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.49 9C19.2214 7.33125 17.2013 6.5 15 6.5C10.8056 6.5 7.5 9.80558 7.5 14C7.5 18.1944 10.8056 21.5 15 21.5C17.2013 21.5 19.2214 20.6687 20.49 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
