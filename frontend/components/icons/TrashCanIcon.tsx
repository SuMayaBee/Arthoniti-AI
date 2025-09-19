import React from "react";

interface TrashCanIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

const TrashCanIcon: React.FC<TrashCanIconProps> = ({
  className = "w-6 h-6",
  color,
  style,
  size = 24,
}) => (
  <svg
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${color}`}
    style={{ width: `${size}px`, height: `${size}px`, ...style }}
  >
    <g clipPath="url(#clip0_15021_921)">
      <path
        d="M10 10.5C10.5523 10.5 11 10.9477 11 11.5V16.5C11 17.0523 10.5523 17.5 10 17.5C9.44772 17.5 9 17.0523 9 16.5V11.5C9 10.9477 9.44772 10.5 10 10.5Z"
        fill="currentColor"
      />
      <path
        d="M15 11.5C15 10.9477 14.5523 10.5 14 10.5C13.4477 10.5 13 10.9477 13 11.5V16.5C13 17.0523 13.4477 17.5 14 17.5C14.5523 17.5 15 17.0523 15 16.5V11.5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.05132 3.18377C8.18744 2.77543 8.56958 2.5 9.00001 2.5H15C15.4304 2.5 15.8126 2.77543 15.9487 3.18377L16.7208 5.5H21C21.5523 5.5 22 5.94772 22 6.5C22 7.05228 21.5523 7.5 21 7.5H19.9356L19.06 20.6331C18.99 21.6837 18.1174 22.5 17.0645 22.5H6.93556C5.88263 22.5 5.01003 21.6837 4.93999 20.6331L4.06445 7.5H3C2.44772 7.5 2 7.05228 2 6.5C2 5.94772 2.44772 5.5 3 5.5H7.27925L8.05132 3.18377ZM6.06889 7.5L6.93556 20.5H17.0645L17.9311 7.5H6.06889ZM14.2792 4.5L14.6126 5.5H9.38743L9.72077 4.5H14.2792Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_15021_921">
        <rect width="20" height="20" fill="white" transform="translate(2 2.5)" />
      </clipPath>
    </defs>
  </svg>
);

export default TrashCanIcon;
