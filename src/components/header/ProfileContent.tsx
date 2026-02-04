import Image from 'next/image'
import React from 'react'
import userAvatar from "@/assests/images/profile.jpg";
import LogoutIcon from "@/assests/icons/logout.png";

interface ProfileContentType{
    userProfileRef: any;
    userState: any;
    handleLogout: any;
}

const ProfileContent:React.FC<ProfileContentType> = ({userProfileRef, userState, handleLogout}) => {
  return (
    <div
    ref={userProfileRef}
    className='absolute flex flex-col items-center justify-center right-0 top-[6.5vw] mr-[3.33vw] w-[17.25vw] h-auto bg-white border border-gray-100 rounded-[1.041vw] z-[10] p-[0.83vw] shadow-custom gap-[0.75rem]'
  >
    <Image
      src={userState?.user?.profile_img ?? userAvatar}
      className='h-[6.666vw] w-[6.4vw] border rounded-[1.5625vw] object-cover mx-auto'
      width={100}
      height={100}
      alt='user'
    />
    <div className='flex flex-col items-center justify-center gap-[0.2rem]'>
      <p className='text-[#282833] font-medium text-[1.25vw] leading-[1.5vw]'>
        {userState?.organization?.name}
      </p>
      <p className='text-[0.75vw]  font-normal leading-[1vw] text-[#282833]'>
        {userState?.user?.email}
      </p>
      <p className='text-[#28283380] text-[0.625vw] font-normal leading-[0.75vw]'>
        Managed by zwilt.com
      </p>
    </div>

    <div
      onClick={handleLogout}
      className='cursor-pointer border border-[#50589F] bg-[#50589F] h-[2.45vw] w-[15.5vw] text-white py-[0.41vw] px-[0.83vw] rounded-[0.7815vw] flex justify-start'
    >
      <Image
        src={LogoutIcon}
        className='w-[1.25vw] h-[1.25vw] mt-[0.1vw] -ml-[0.2vw] mr-[0.3vw]'
        width={100}
        height={100}
        alt='Log out Icon'
      />
      <p className='px-[0.4vw] py-[0.25vw] text-white text-[0.82vw] font-normal text-left leading-[1vw]'>
        Logout
      </p>
    </div>
  </div>
  )
}

export default ProfileContent