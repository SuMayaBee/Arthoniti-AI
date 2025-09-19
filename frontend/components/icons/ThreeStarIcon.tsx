type ThreeStarIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function ThreeStarIcon({
  size = 24,
  color = '#9E32DD',
  className = '',
}: ThreeStarIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 21 20"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.5 11.667C15.8588 13.3369 17.163 14.6414 18.833 15C17.163 15.3586 15.8588 16.6631 15.5 18.333C15.1413 16.663 13.836 15.3586 12.166 15C13.836 14.6414 15.1413 13.337 15.5 11.667ZM8.05957 1.83301C8.81912 5.37014 11.5821 8.13385 15.1191 8.89355C11.5822 9.65327 8.81918 12.4161 8.05957 15.9531C7.29995 12.4161 4.53699 9.65325 1 8.89355C4.5371 8.13387 7.30001 5.37016 8.05957 1.83301ZM16.333 1.66699C16.6021 2.9194 17.5805 3.89804 18.833 4.16699C17.5804 4.43597 16.602 5.41442 16.333 6.66699C16.064 5.41448 15.0855 4.43602 13.833 4.16699C15.0855 3.89803 16.0639 2.91941 16.333 1.66699Z"
        fill={color}
      />
    </svg>
  );
}
