import { styled } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";

interface AvatarT {
  img: string | undefined;
  initial: string;
  width?: string | number;
  height?: string | number;
}

interface AvatarWrapperT {
  width?: string | number;
  height?: string | number;
}

const AvatarWrapper = styled("div")<AvatarWrapperT>`
  position: relative;
  width: ${(props) => {
    if (typeof props.width === "number") return `${props.width}px`;
    return props.width || "1.5rem";
  }};
  height: ${(props) => {
    if (typeof props.height === "number") return `${props.height}px`;
    return props.height || "1.5rem";
  }};
  border-radius: 50%;
  background: #244bb6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 80%;
  overflow: hidden;

  img {
    object-fit: cover;
  }
`;

const Avatar: React.FC<AvatarT> = ({
  img,
  initial,
  width,
  height,
}) => {
  const [imgError, setImgError] = useState(false);
  const onImgError = (err: any) => setImgError(true);
  return (
    <AvatarWrapper width={width} height={height}>
      {img && !imgError ? (
        <Image
          fill
          src={img}
          alt=""
          onError={onImgError}
        />
      ) : (
        <span>{initial?.charAt(0)?.toUpperCase() || "U"}</span>
      )}
    </AvatarWrapper>
  );
};

export default Avatar;

