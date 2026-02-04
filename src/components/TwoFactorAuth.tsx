import { securityPage } from "@/types/GeneralType";
import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { useRecoilState } from "recoil";
import { isAuthenticated } from "../../utils/recoil_store/atoms/security-atom";
import useUser from "../../utils/recoil_store/hooks/use-user-state";

interface GenAuthType {
  phone: string;
  isTwoFactorEnabled: boolean;
  isAuthenticatorEnabled: boolean;
  isPhoneTwoFactorEnabled: boolean;
}

const TwoFactorAuth: React.FC<securityPage> = ({
  setOpenCard,
  setOpenAuthenticator,
}) => {
  const { userState } = useUser();
  const currentUser = userState?.currentUser?.user;
  console.log("currentUser", currentUser);

  return (
    <div className='text-[#282833] '>
      <div className='px-[1.25vw] border-b pb-[2.4vh]'>
        <p className='font-[600] text-[1.042vw]'>Turn on 2-Step Verficiation</p>
        <p className='w-[34.63vw] text-[#6F6F76] font-[400] text-[0.83vw]'>
          Enabling this will provide an extra security layer to your account.
          When logging in, we will ask for special authentication code from your
          device.{" "}
        </p>
      </div>
      {/* phone number */}
      <div className='px-[1.25vw] flex gap-[6.25vw] border-b pb-[2.4vh] py-[2.4vh] items-center'>
        <div className='w-[20.16vw]'>
          <p className='font-[600] text-[1.04vw]'>Phone Number </p>
          <p className='text-[#6F6F76] text-[0.83vw] font-[400]'>
            Use your phone number to receive security code
          </p>
        </div>

        {/* unverified phone */}
        <div
          onClick={() => setOpenCard(true)}
          className={` ${
            currentUser?.isPhoneTwoFactorEnabled ? "hidden" : "flex"
          } font-[500]  items-center cursor-pointer  text-[#282833] gap-[0.42vw] w-fit h-[5vh] hover:border-[#B8B8CD] opacity-[70%] hover:opacity-[100%] hover:bg-[#F4F4FA] text-[0.83vw] border-[1px] border-[#E0E0E9] px-[0.83vw]  rounded-[0.78vw]`}
        >
          <AiOutlinePlus />
          <p> Add Phone Number</p>
        </div>

        {/* verified phone */}
        <div
          className={` ${
            currentUser?.isPhoneTwoFactorEnabled ? "flex" : "hidden"
          } gap-[1.25vw] text-[#6F6F76] items-center `}
        >
          <div>
            <p> {currentUser?.phone}</p>
          </div>
          <div className='flex items-center gap-[0.21vw] font-[500]'>
            <IoCheckmarkCircleSharp className='text-[#17B26A] text-[1.25vw]' />
            <p>Phone Verified</p>
          </div>
          <div
            onClick={() => setOpenCard(true)}
            className='border-[1px] font-[500] text-[0.83vw] border-[#E0E0E9] px-[1.042vw] py-[1vh] rounded-[0.78vw] cursor-pointer hover:bg-[#F4F4FA]'
          >
            Edit
          </div>
        </div>
      </div>

      {/* authenticator */}
      <div className='px-[1.25vw] flex gap-[6.25vw] py-[2.4vh]  border-b pb-[2.4vh] items-center'>
        <div className='w-[20.16vw]'>
          <p className='font-[600] text-[1.04vw]'>Authenticator</p>
          <p className='text-[#6F6F76] text-[0.83vw] font-[400]'>
            User google authenticator app to generate one time security code
          </p>
        </div>

        {/* unverified authenticator */}
        <div
          onClick={() => setOpenAuthenticator(true)}
          className={` ${
            currentUser?.isAuthenticatorEnabled ? "hidden" : "flex"
          } font-[500]  items-center cursor-pointer text-[#282833]  gap-[0.42vw] w-fit h-[5vh]  hover:border-[#B8B8CD]  opacity-[70%] hover:opacity-[100%] hover:bg-[#F4F4FA] text-[0.83vw] border-[1px] border-[#E0E0E9] px-[0.83vw]  rounded-[0.78vw]`}
        >
          <AiOutlinePlus />
          <p> Add Authenticator App</p>
        </div>

        {/* verified authenticator */}
        <div
          className={` ${
            currentUser?.isAuthenticatorEnabled ? "flex" : "hidden"
          } gap-[1.042vw] text-[#6F6F76] items-center `}
        >
          <div>
            <p className=' text-[0.83vw] font-[500]'>Google Authenticator</p>
          </div>
          <div className='flex items-center gap-[0.21vw]'>
            <IoCheckmarkCircleSharp className='text-[#17B26A] text-[1.25vw]' />
            <p className=' text-[0.83vw] font-[500]'>Verified</p>
          </div>
          <div
            onClick={() => setOpenAuthenticator(true)}
            className='flex items-center text-[0.83vw] gap-[0.52vw] border-[0.1vh] border-[#E0E0E9] px-[1.042vw] py-[1vh] rounded-[0.782vw] cursor-pointer hover:bg-[#F4F4FA] hover:border-[#B8B8CD]'
          >
            <AiOutlinePlus />
            <p className='font-[500]'>Add New</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
