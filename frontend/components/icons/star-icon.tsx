import React from "react";

interface IconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

export function StarIcon({
  className = "w-6 h-6",
  color,
  style,
  size = 24,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} ${color}`}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.5332 8.68262C14.6785 8.99764 14.977 9.21579 15.3232 9.25684L21.3271 9.96875L21.3262 9.96973L16.8887 14.0742C16.633 14.3107 16.5193 14.6624 16.5869 15.0029L17.7646 20.9326V20.9336L12.4893 17.9795C12.2232 17.8306 11.9074 17.8135 11.6299 17.9248L11.5127 17.9805L6.2373 20.9326H6.23633L7.41504 15.0039C7.48259 14.6639 7.36944 14.3111 7.11328 14.0742L2.6748 9.96875L8.67773 9.25684C9.02201 9.21602 9.32262 9.00013 9.46875 8.68359L12.001 3.19336L14.5332 8.68262Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
