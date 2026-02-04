import React from "react";

interface Props {
  rotated: any;
}

export default function HeaderChevron({ rotated }: Props) {
  return (
    <svg
      className="ml-[0.52vw] w-[1.04vw] h-[0.26vw] transition-transform duration-300"
      style={{
        transform: rotated ? "rotate(-180deg)" : "rotate(0deg)",
      }}
      viewBox="0 0 18 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L9 9L17 1"
        stroke="#282833"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
