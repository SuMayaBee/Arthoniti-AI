import React from "react";

interface EnvelopeIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

export default function EnvelopeIcon({
  className = "w-6 h-6",
  color,
  style,
  size = 24,
}: EnvelopeIconProps) {
  return (
    <svg
      className={`${className} ${color ?? ""}`}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 5C22 4.44772 21.5523 4 21 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44771 20 3 20H21C21.5523 20 22 19.5523 22 19V5ZM5.58124 6.18627C5.13183 5.86526 4.50728 5.96935 4.18627 6.41876C3.86526 6.86817 3.96935 7.49272 4.41876 7.81373L11.4188 12.8137C11.7665 13.0621 12.2335 13.0621 12.5812 12.8137L19.5812 7.81373C20.0307 7.49272 20.1347 6.86817 19.8137 6.41876C19.4927 5.96935 18.8682 5.86526 18.4188 6.18627L12 10.7711L5.58124 6.18627Z"
        fill="currentColor"
      />
    </svg>
  );
}
