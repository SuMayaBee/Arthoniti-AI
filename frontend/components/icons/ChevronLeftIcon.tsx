import type { CSSProperties } from 'react';

type ChevronLeftIconProps = {
  className?: string;
  color?: string;
  style?: CSSProperties;
  size?: number;
};

function ChevronLeftIcon({
  className = 'w-6 h-6',
  color,
  style,
  size = 24,
}: ChevronLeftIconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
    >
      <path
        d="M15 5L9 12L15 19"
        stroke={color ?? 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ChevronLeftIcon;
