import React from "react";

interface FAQIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

const FAQIcon: React.FC<FAQIconProps> = ({
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
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

export default FAQIcon;
