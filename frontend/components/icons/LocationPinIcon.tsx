import React from "react";

interface LocationPinIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

export default function LocationPinIcon({
  className = "w-6 h-6",
  color,
  style,
  size = 24,
}: LocationPinIconProps) {
  return (
    <svg
      className={`${className} ${color ?? ""}`}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.7737 3.98053C9.7762 1.33982 14.2238 1.33982 17.2263 3.98053C20.5901 6.93903 20.9423 12.1211 18.0198 15.5246L12.7587 21.6515C12.5687 21.8727 12.2916 22 12 22C11.7084 22 11.4313 21.8727 11.2413 21.6515L5.98017 15.5246C3.05764 12.1211 3.40988 6.93903 6.7737 3.98053ZM12 12.5C13.3807 12.5 14.5 11.3807 14.5 10C14.5 8.61929 13.3807 7.5 12 7.5C10.6193 7.5 9.5 8.61929 9.5 10C9.5 11.3807 10.6193 12.5 12 12.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
