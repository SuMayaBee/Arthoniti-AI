import React from "react";

interface ShieldLockIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

const ShieldLockIcon: React.FC<ShieldLockIconProps> = ({
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
    <path d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 10V8C6 4.68629 8.68629 2 12 2C14.7958 2 17.1449 3.91216 17.811 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default ShieldLockIcon;

