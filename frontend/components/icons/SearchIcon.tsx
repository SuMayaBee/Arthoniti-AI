import React from "react";

interface SearchIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

const SearchIcon: React.FC<SearchIconProps> = ({
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
      d="M9.00009 3.93754C6.20412 3.93754 3.93754 6.20412 3.93754 9.00009H5.06255C5.06255 6.82545 6.82545 5.06255 9.00009 5.06255V3.93754Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 9.7501C0 4.36527 4.36527 0 9.7501 0C15.1349 0 19.5002 4.36527 19.5002 9.7501C19.5002 12.2035 18.594 14.4452 17.0982 16.1589C17.2106 16.1938 17.3165 16.2558 17.4055 16.3448L22.5002 21.4396C22.7931 21.7325 22.7931 22.2073 22.5002 22.5002C22.2073 22.7931 21.7325 22.7931 21.4396 22.5002L16.3448 17.4055C16.2558 17.3165 16.1938 17.2106 16.1589 17.0982C14.4452 18.594 12.2035 19.5002 9.7501 19.5002C4.36527 19.5002 0 15.1349 0 9.7501ZM9.7501 1.50002C5.1937 1.50002 1.50002 5.1937 1.50002 9.7501C1.50002 14.3065 5.1937 18.0002 9.7501 18.0002C14.3065 18.0002 18.0002 14.3065 18.0002 9.7501C18.0002 5.1937 14.3065 1.50002 9.7501 1.50002Z"
      fill="currentColor"
    />
  </svg>
);

export default SearchIcon;
