import React from "react";

interface OverviewIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

const OverviewIcon: React.FC<OverviewIconProps> = ({
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 4C3 3.44772 3.44772 3 4 3H10C10.5523 3 11 3.44772 11 4V10C11 10.5523 10.5523 11 10 11H4C3.44772 11 3 10.5523 3 10V4ZM5 5V9H9V5H5Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 14C3 13.4477 3.44772 13 4 13H10C10.5523 13 11 13.4477 11 14V20C11 20.5523 10.5523 21 10 21H4C3.44772 21 3 20.5523 3 20V14ZM5 15V19H9V15H5Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 11C13.4477 11 13 10.5523 13 10V4C13 3.44772 13.4477 3 14 3L20 3C20.5523 3 21 3.44772 21 4V10C21 10.5523 20.5523 11 20 11L14 11ZM15 9L19 9V5L15 5V9Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 14C13 13.4477 13.4477 13 14 13H20C20.5523 13 21 13.4477 21 14V20C21 20.5523 20.5523 21 20 21H14C13.4477 21 13 20.5523 13 20V14ZM15 15V19H19V15H15Z"
      fill="currentColor"
    />
  </svg>
);

export default OverviewIcon;
