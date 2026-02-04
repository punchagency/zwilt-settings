import React, { useState } from "react";
import { motion } from "framer-motion";
import { switchType } from "@/types/GeneralType";
import { useRecoilState } from "recoil";
import { isAuthenticated } from "../../utils/recoil_store/atoms/security-atom";
import styled from "@emotion/styled";
import { Switch } from "@mui/material";

interface propType {
  isToggled: boolean;
}

const NotificationToggle: React.FC<propType> = ({ isToggled }) => {
  //const [isToggled, setIsToggled] = useRecoilState(isAuthenticated);

  //   const handleToggle = () => {
  //     setIsToggled((prev) => !prev);
  //   };

  return (
    <div className=''>
      {/* <motion.div
        layout
        className={`w-[2.083vw] h-[2.4vh] rounded-full px-[0.21vw] py-[0.4vh] cursor-pointer flex items-center ${
          isToggled ? "bg-[#50589F]" : "bg-gray-300"
        }`}
        
      >
        <motion.div
          className={`w-[1.041vw] h-[2vh] rounded-full bg-white  ${
            isToggled ? "translate-x-8" : ""
          }`}
          animate={{ x: isToggled ? "60%" : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div> */}
      <TSwitch defaultChecked={isToggled} />
    </div>
  );
};

export default NotificationToggle;

const TSwitch = styled(Switch)(({ theme }) => ({
  width: 40,
  height: 24,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#50589F",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 20,
    height: 20,
    borderRadius: 16,
    transition: "width 200ms ease-in-out",
  },
  "& .MuiSwitch-track": {
    borderRadius: 60 / 2,
    opacity: 1,
    backgroundColor: "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));
