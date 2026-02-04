import { BasicProps } from "@/types/GeneralType";
import React, { useState } from "react";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import SwitchCustomStyle from "../SwitchCustomStyle";
import Image from "next/image";
import { BasicsArray } from "@/arrays/BasicsArray";
import deleteicon from "../../assests/icons/delete.svg";
import { useReactiveVar } from "@apollo/react-hooks";
import Devices from "@/components/security/Devices";

const Basics: React.FC<BasicProps> = ({
  currentPassword,
  setActive,
  isToggled,
  setIsToggled,
}) => {
  // const [signedInDevices, setSignedInDevices] = useState<SignedInDevice[]>([]);
  return (
    <div className=' text-[#282833]'>
      <div className='px-[1.25vw] flex items-center gap-[5.83vw]  border-b pb-[3.2vh] '>
        <div>
          <p className=' font-[600] text-[1.042vw]'>Password</p>
          <p className='text-[0.83vw] font-[400] text-[#6F6F76] w-[20.16vw] '>
            Set a password to protect your account
          </p>
        </div>
        <div className='flex items-center gap-[0.93vw]'>
          <input
            type='password'
            readOnly
            value={currentPassword}
            className='w-[6.25vw] outline-none opacity-[60%] font-[600] text-[1.25vw]'
          />
          <span className='flex items-center text-[1.25vw] gap-[0.26vw]'>
            <IoCheckmarkCircleSharp className='text-[#17B26A]' />{" "}
            <p className='text-[0.73vw] opacity-[60%]'>Very Secure</p>
          </span>
          <div
            onClick={() => setActive("Change Password")}
            className='cursor-pointer flex font-[500] items-center bg-white  py-[0.8vh] px-[1.25vw] ml-[0.63vw] border rounded-[0.78vw] border-[#E0E0E9] hover:border-gray-500  opacity-[70%] hover:opacity-[100%] hover:bg-[#F4F4FA] browser text-[0.83vw]'
          >
            Change
          </div>
        </div>
      </div>
      <div className='px-[1.25vw] flex gap-[5.83vw] items-center py-[3.2vh]  border-b'>
        <div className=''>
          <p className=' font-[600] text-[1.04vw]'>Two Factor Authentication</p>
          <p className='w-[20.16vw] text-[0.83vw] font-[400] text-[#6F6F76]'>
            We recommend requiring a verification code in addition to passwords.{" "}
          </p>
        </div>
        <div className='flex gap-[0.83vw]'>
          <SwitchCustomStyle
            isToggled={isToggled}
            setIsToggled={setIsToggled}
            setActive={setActive}
          />
          <p className='text-[0.83vw]'>Two Factor Authentication </p>
        </div>
      </div>

      <Devices />
    </div>
  );
};

export default Basics;
