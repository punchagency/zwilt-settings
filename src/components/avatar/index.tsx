import { styled } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";

interface AvatarT {
  img: string | undefined;
  initial: string;
  width?: string;
  height?: string;
}

interface AvatarWrapperT {
  width?: string;
  height?: string;
}

const AvatarWrapper = styled("div")<AvatarWrapperT> `
    width: ${(props) => props.width || "1.5rem"};
    height: ${(props) => props.height || "1.5rem"};
    border-radius: 50%;
    background: #244BB6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 80%;

     > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
     }
    `;
const Avatar: React.FC<AvatarT> = ({ img, initial }) => {
  const [imgError, setImgError] = useState(false)
  const onImgError = (err: any) => setImgError(true)
  return (
    <AvatarWrapper>
      {img && !imgError ? (
        <Image width={100} height={100} src={img} alt="" onError={onImgError}/>
      ) : (
        <span>{initial?.charAt(0)?.toUpperCase() || "U"}</span>
      )}
    </AvatarWrapper>
  );
};

export default Avatar;
