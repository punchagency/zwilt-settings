import Image from "next/image";
import React from "react";
import userAvatar from "@/assests/images/profile.jpg";
import HeaderChevron from "../HeaderChevron";

interface profileDetailType {
  profileRef: any;
  toggleProfileDetails: any;
  userState: any;
  rotated: any;
}

const ProfileDetail: React.FC<profileDetailType> = ({
  profileRef,
  toggleProfileDetails,
  userState,
  rotated,
}) => {
  return (
    <div>
      <button
        ref={profileRef}
        onClick={toggleProfileDetails}
        className='ml-[0.44vw] flex items-center justify-center w-[12.21vw] h-[3.13vw] space-x-[1.041vw] border border-[#E0E0E9] rounded-[1.041vw] p-[0.52vw] focus:outline-none relative'
      >
        <div className='flex items-center justify-start w-[8.35vw] h-[2.08vw]'>
          <div className='relative'>
            <div className='absolute right-0 w-[0.52vw] h-[0.52vw] rounded-[0.52vw]  bg-[#3AD349] border-[0.104vw] border-[#fff] z-[10]'></div>
            <Image
              src={userState?.user?.profile_img ?? userAvatar}
              className='h-[2.15vw] w-[2.15vw] border rounded-[0.63vw] object-cover'
              width={41.38}
              height={40}
              alt='Profile'
            />
          </div>

          {/* gap-[0.26vw] */}
          <div className='flex flex-col justify-center items-start ml-[0.41vw] w-[5.68vw] leading-normal'>
            {/* text-[0.729vw] */}
            <h6 className='text-[0.81vw] font-normal text-[#282833] whitespace-nowrap text-ellipsis overflow-hidden'>
              {userState?.user?.name}
            </h6>

            <p className='text-[0.625vw] font-normal text-[#939399] whitespace-nowrap text-ellipsis overflow-hidden capitalize'>
              {userState?.organization?.name}
            </p>
          </div>
        </div>
        <div className='w-[1.77vw] ml-[1.04vw] h-[1.25vw] flex items-center justify-center border-0 border-l border-[#28283333]'>
          <HeaderChevron rotated={rotated} />
        </div>
      </button>
    </div>
  );
};

export default ProfileDetail;
