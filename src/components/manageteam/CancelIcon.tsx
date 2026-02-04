import React from "react";

interface CancelIconProps {
    isHovered: boolean;
}
const CancelIcon = ({ isHovered }: CancelIconProps) => {
    return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.4" y="0.4" width="21.2" height="21.2" rx="4.6" fill={isHovered ? "#F4F4FA":"white"}/>
        <rect x="0.4" y="0.4" width="21.2" height="21.2" rx="4.6" stroke="#E0E0E9" stroke-width="0.8"/>
        <path d="M15 14.9968L7 7.00227M14.9972 6.99951L7.00276 15.0002" stroke="#282833" stroke-width="1.5"/>
        </svg>
        )
}
export default CancelIcon;