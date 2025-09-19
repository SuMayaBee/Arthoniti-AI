import type React from "react";

interface BreadcrumbIconProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  /** Tailwind class applied to the background circle (uses currentColor via text-*) */
  bgClass?: string;
  /** Tailwind class applied to the icon stroke (uses currentColor via text-*) */
  iconClass?: string;
}

const BreadcrumbIcon: React.FC<BreadcrumbIconProps> = ({
  className = 'w-6 h-6',
  style,
  size = 24,
  bgClass = 'text-primary-50',
  iconClass = 'text-primary-500',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: `${size}px`, height: `${size}px`, ...style }}
  >
    <title>Breadcrumb</title>
    {/* rounded background */}
    <circle cx={12} cy={12} r={12} fill="currentColor" className={bgClass} />

    {/* icon strokes - use currentColor for stroke and control color via iconClass */}
    <g className={iconClass}>
      <path
        d="M5 17H13"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 7H13"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default BreadcrumbIcon;
