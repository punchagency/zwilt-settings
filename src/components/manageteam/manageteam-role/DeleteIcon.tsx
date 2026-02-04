import React, { useState } from "react";

const DeleteIcon: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <svg
      width="24"
      height="24"
      className=" w-[1.25vw] h-[1.25vw] text-[#6F6F76] hover:text-[#282833]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 7H19"
        stroke={isHovered ? "#282833" : "#6F6F76"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M18 7V18C18 19.105 17.105 20 16 20H8C6.895 20 6 19.105 6 18V7"
        stroke={isHovered ? "#282833" : "#6F6F76"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15 3.75H9"
        stroke={isHovered ? "#282833" : "#6F6F76"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 11V16"
        stroke={isHovered ? "#282833" : "#6F6F76"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14 11V16"
        stroke={isHovered ? "#282833" : "#6F6F76"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default DeleteIcon;
