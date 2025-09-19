import React from "react";

interface RightArrowMdIconProps {
  className?: string;
  color?: string; // Tailwind color utility like "text-white"
  style?: React.CSSProperties;
  size?: number; // pixel size
}

const RightArrowMdIcon: React.FC<RightArrowMdIconProps> = ({
  className = "w-6 h-6",
  color,
  style,
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${color ?? ""}`}
    style={{ width: `${size}px`, height: `${size}px`, ...style }}
  >
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default RightArrowMdIcon;

