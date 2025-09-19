import React from "react";

interface PaperClipTiltIconProps {
  className?: string;
  color?: string; // Tailwind color utility like "text-white"
  style?: React.CSSProperties;
  size?: number; // pixels
}

const PaperClipTiltIcon: React.FC<PaperClipTiltIconProps> = ({
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
    <path
      d="M4.53516 11.4647L11.4294 4.5704C13.4797 2.52015 16.8039 2.52015 18.8541 4.5704C20.9044 6.62066 20.9041 9.94496 18.8539 11.9952L10.8989 19.9502C9.53209 21.317 7.31639 21.3168 5.94955 19.95C4.58272 18.5831 4.58238 16.3673 5.94922 15.0005L13.9042 7.0455C14.5876 6.36208 15.6962 6.36208 16.3796 7.0455C17.0631 7.72892 17.0626 8.83669 16.3792 9.52011L9.48486 16.4144"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PaperClipTiltIcon;

