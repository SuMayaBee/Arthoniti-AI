import React from "react";

interface EditPencilLineIconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

const EditPencilLineIcon: React.FC<EditPencilLineIconProps> = ({
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
    <path
      d="M4 20.5001H20M4 20.5001V16.5001L12 8.50012M4 20.5001L8 20.5001L16 12.5001M12 8.50012L14.8686 5.63146L14.8704 5.62976C15.2652 5.23488 15.463 5.03709 15.691 4.96301C15.8919 4.89775 16.1082 4.89775 16.3091 4.96301C16.5369 5.03704 16.7345 5.2346 17.1288 5.62892L18.8686 7.36872C19.2646 7.76474 19.4627 7.96284 19.5369 8.19117C19.6022 8.39201 19.6021 8.60835 19.5369 8.8092C19.4628 9.03736 19.265 9.23516 18.8695 9.63061L18.8686 9.63146L16 12.5001M12 8.50012L16 12.5001"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default EditPencilLineIcon;
