import React from "react";
import { calculatePxToPercentage } from "../../utils/cssHelper";

type XIconProps = {
  isHovered?: boolean;
};

const XIcon: React.FC<XIconProps> = ({ isHovered }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={calculatePxToPercentage(40)}
      height={calculatePxToPercentage(40)}
      viewBox="0 0 40 40"
      fill="none"
      className="group"
    >
      <rect
        x="0.4"
        y="0.4"
        width="39.2"
        height="39.2"
        rx="11.6"
        fill="white"
        stroke="#E0E0E9"
        strokeWidth="0.8"
      />
      <path
        d="M27.8599 27.9931L11.8613 12.0055M27.8544 12L11.8668 28"
        stroke="#282833"
        strokeWidth="1.5"
        className={`transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-70"
        } group-hover:opacity-100`}
      />
    </svg>
  );
};

export default XIcon;
