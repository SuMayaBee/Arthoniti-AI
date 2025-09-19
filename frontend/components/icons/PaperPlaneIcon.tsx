import React from "react";

interface PaperPlaneIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

export default function PaperPlaneIcon({
  className = "w-6 h-6",
  color,
  style,
  size = 24,
}: PaperPlaneIconProps) {
  return (
    <svg
      className={`${className} ${color ?? ""}`}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_12007_3504)">
        <path
          d="M21.3865 11.0889L3.59493 3.03838C2.7702 2.6652 1.91359 3.49244 2.25778 4.32968L4.99997 11L17 12L4.99997 13L2.25778 19.6702C1.91359 20.5075 2.77019 21.3347 3.59492 20.9615L21.3865 12.911C22.1702 12.5564 22.1702 11.4435 21.3865 11.0889Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_12007_3504">
          <rect width="20" height="20" fill="white" transform="translate(2 2)" />
        </clipPath>
      </defs>
    </svg>
  );
}
