import React from "react";

interface UpperArrowMdIconProps {
  className?: string;
  color?: string; // Tailwind color utility like "text-white"
  style?: React.CSSProperties;
  size?: number; // pixel size
}

const UpperArrowMdIcon: React.FC<UpperArrowMdIconProps> = ({
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
    <path d="M12 19V5M12 5L6 11M12 5L18 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default UpperArrowMdIcon;

