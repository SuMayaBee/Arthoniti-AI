import React from "react";

interface RefreshArrowsCircleIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

const RefreshArrowsCircleIcon: React.FC<RefreshArrowsCircleIconProps> = ({
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
    <g clipPath="url(#clip0_12007_2037)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.99996 4.85874C6.80295 3.09135 9.27389 2 12 2C17.5228 2 22 6.47715 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12C20 7.58172 16.4183 4 12 4C9.79545 4 7.79878 4.89119 6.35089 6.33528L7.78745 6.0228C8.32712 5.90541 8.85976 6.24774 8.97715 6.7874C9.09454 7.32707 8.75221 7.85972 8.21255 7.9771L4.21249 8.84719C3.91687 8.91149 3.60803 8.8385 3.37246 8.64867C3.1369 8.45883 2.99994 8.17256 2.99994 7.87003L2.99997 3.99993C2.99997 3.44765 3.44769 2.99994 3.99998 2.99994C4.55226 2.99994 4.99997 3.44766 4.99997 3.99995L4.99996 4.85874ZM3 11C3.55228 11 4 11.4477 4 12C4 16.4183 7.58172 20 12 20C14.2046 20 16.2012 19.1088 17.6491 17.6647L16.2125 17.9772C15.6728 18.0946 15.1402 17.7523 15.0228 17.2126C14.9054 16.6729 15.2477 16.1403 15.7874 16.0229L19.7875 15.1528C20.0831 15.0885 20.3919 15.1615 20.6275 15.3513C20.8631 15.5412 21 15.8274 21 16.13L21 20.0001C21 20.5523 20.5523 21.0001 20 21.0001C19.4477 21.0001 19 20.5523 19 20L19 19.1413C17.197 20.9087 14.7261 22 12 22C6.47715 22 2 17.5228 2 12C2 11.4477 2.44772 11 3 11Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_12007_2037">
        <rect width="20" height="20" fill="white" transform="matrix(1 0 0 -1 2 22)"/>
      </clipPath>
    </defs>
  </svg>
);

export default RefreshArrowsCircleIcon;

