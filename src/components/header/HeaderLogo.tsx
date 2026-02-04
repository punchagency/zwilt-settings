import Image from "next/image";
import React from "react";
import ZwiltIcon from "@/assests/icons/zwiltlogo.svg";
import { useRouter } from "next/router";

const HeaderLogo = () => {
  const router = useRouter();
  return (
    <div className="flex items-center w-[16%] p-4 gap-2 mr-8 -ml-5`````````````````````````````````````````````````````````````````````````````````````````````````````">
      <Image
        className="w-[1.80vw] h-[1.4]"
        src={ZwiltIcon}
        alt="Zwilt Icon"
        width={34.97}
        height={21.87}
      />

      {/* <h1 className="text-[1.25vw] font-bold whitespace-nowrap ml-[0.83vw]"> */}
      <h1
        className="text-[1.15vw] font-semibold whitespace-nowrap"
        onClick={() => router.push("/")}
        style={{ cursor: "pointer" }}
      >
        Zwilt Accounts Settings
      </h1>
    </div>
  );
};

export default HeaderLogo;
