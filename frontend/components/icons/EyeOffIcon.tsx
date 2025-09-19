interface IconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

export function EyeOffIcon({
  className = "w-6 h-6",
  color,
  style,
  size = 24,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${color}`}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
    >
      <path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2 16 2 12C2 8 5 4 10 3.06"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 4.24A9.12 9.12 0 0 1 12 4C19 4 22 12 22 12C22 12 21.5 13.5 20.5 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.12 14.12A3 3 0 0 1 9.88 9.88"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 1L23 23"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
