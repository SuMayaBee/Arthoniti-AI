import React from 'react';

interface CheckIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function CheckIcon({
  size = 24,
  color = 'currentColor',
  className = '',
}: CheckIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
    >
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}
