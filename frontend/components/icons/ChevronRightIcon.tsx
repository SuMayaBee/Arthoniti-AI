import React from "react";

interface ChevronRightIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({
  className = "w-6 h-6",
  color,
  style,
  size = 24,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${color}`}
    style={{ width: `${size}px`, height: `${size}px`, ...style }}
  >
    <path
      d="M9 5L15 12L9 19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChevronRightIcon;
