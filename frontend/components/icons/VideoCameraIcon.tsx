import React from "react";

interface IconProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}

 function VideoCameraIcon({
  className = "w-6 h-6",
  color = "#1C274C",
  style,
  size = 24,
}: IconProps) {
  return (
    <svg
      className={`${className} ${color}`}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 11.5C2.5 8.21252 2.5 6.56878 3.40796 5.46243C3.57418 5.25989 3.75989 5.07418 3.96243 4.90796C5.06878 4 6.71252 4 10 4C13.2875 4 14.9312 4 16.0376 4.90796C16.2401 5.07418 16.4258 5.25989 16.592 5.46243C17.5 6.56878 17.5 8.21252 17.5 11.5V12.5C17.5 15.7875 17.5 17.4312 16.592 18.5376C16.4258 18.7401 16.2401 18.9258 16.0376 19.092C14.9312 20 13.2875 20 10 20C6.71252 20 5.06878 20 3.96243 19.092C3.75989 18.9258 3.57418 18.7401 3.40796 18.5376C2.5 17.4312 2.5 15.7875 2.5 12.5V11.5Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M17.5 9.50019L18.1584 9.17101C20.1042 8.19807 21.0772 7.7116 21.7886 8.15127C22.5 8.59094 22.5 9.67872 22.5 11.8543V12.1461C22.5 14.3217 22.5 15.4094 21.7886 15.8491C21.0772 16.2888 20.1042 15.8023 18.1584 14.8294L17.5 14.5002V9.50019Z"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default VideoCameraIcon