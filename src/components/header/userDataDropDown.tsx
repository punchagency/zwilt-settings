import GetDomains from "@/containers/domains/GetDomains";
import Image from "next/image";
import React from "react";
import MailLogo from "@/assests/icons/Logo=Mail.svg";
import SalesLogo from "@/assests/icons/Logo=Sales App.svg";
import StoreLogo from "@/assests/icons/Logo=Store.svg";
import TrackerLogo from "@/assests/icons/Logo=Tracker2.svg";
import Recrowdly from "@/assests/icons/Recrowdly.png";
import ZwiltTracker2 from "@/assests/icons/ZwiltTracker2.png";

interface userDataDropDownTYpe {
  groupRef: any;
  handleNavigation: any;
}

const UserDataDropDown: React.FC<userDataDropDownTYpe> = ({
  groupRef,
  handleNavigation,
}) => {
  const {
    StoreDomain,
    getTrackerApp,
    getRecrowdlyAppDomain,
    getSalesAppDomain,
    getMailDomain,
  } = GetDomains();

  return (
    <div
      ref={groupRef}
      className='cursor-pointer absolute right-0 top-[3.83vw] ml-[0.44vw]  w-[15vw] bg-white border border-gray-300 rounded-[1.041vw] z-10 p-[0.83vw] shadow-custom2'
    >
      <div className='grid grid-cols-2 gap-[0.41vw] h-auto'>
        <div
          onClick={() => handleNavigation(StoreDomain)}
          className='flex flex-col items-center justify-center hover:bg-[#F4F4FA] h-[6vw] rounded-[1.042vw] cursor-pointer'
        >
          <div className='h-[2.91vw] w-[2.91vw] mb-[0.20vw] flex items-center justify-center bg-gray-200 rounded-[520.78vw]'>
            <Image
              alt='Zwilt Store Icon'
              src={StoreLogo}
              width={100}
              height={100}
            />
          </div>
          <p className='font-medium text-[#282833] text-[0.83vw]'>Recruit</p>
        </div>

        <div
          onClick={() => {
            handleNavigation(getTrackerApp);
          }}
          className='flex flex-col items-center justify-center hover:bg-[#F4F4FA]  h-[6vw] rounded-[1.042vw] cursor-pointer'
        >
          <div className='h-[2.91vw] w-[2.91vw] mb-1 flex items-center justify-center bg-gray-200 rounded-[520.78vw]'>
            <Image
              alt='Zwilt Tracker Icon'
              src={TrackerLogo}
              width={100}
              height={100}
            />
          </div>
          <p className='font-medium text-[0.83vw] text-[#282833]'>Track</p>
        </div>

        <div
          onClick={() => {
            handleNavigation(getSalesAppDomain);
          }}
          className='flex flex-col items-center justify-center hover:bg-[#F4F4FA] mt-[0.2vw] h-[6vw] rounded-[1.042vw] cursor-pointer'
        >
          <div className='h-[2.91vw] w-[2.91vw] mb-1 flex items-center justify-center bg-gray-200 rounded-[520.78vw]'>
            <Image alt='Sales Icon' src={SalesLogo} width={100} height={100} />
          </div>
          <p
            className='font-semibold'
            style={{
              fontFamily: "Switzer",
              fontSize: "0.83vw",
              fontWeight: 500,
              color: "#282833",
            }}
          >
            Sell
          </p>
        </div>

        <div
          onClick={() => {
            handleNavigation(getRecrowdlyAppDomain);
          }}
          className='flex flex-col items-center justify-center hover:bg-[#F4F4FA] rounded-[1.042vw] cursor-pointer'
        >
          <div className='h-[2.91vw] w-[2.91vw] mb-1 flex items-center justify-center bg-gray-200 rounded-[520.78vw]'>
            <Image
              alt='Recrowdly Icon'
              src={Recrowdly}
              width={100}
              height={100}
            />
          </div>
          <p
            className='font-semibold'
            style={{
              fontFamily: "Switzer",
              fontSize: "0.83vw",
              fontWeight: 500,
              color: "#282833",
            }}
          >
            Market
          </p>
        </div>
        <div
          onClick={() => {
            handleNavigation(StoreDomain);
          }}
          className='flex flex-col items-center justify-center hover:bg-[#F4F4FA] mt-[0.2vw] h-[6vw] rounded-[1.042vw] cursor-pointer'
        >
          <div className='h-[2.91vw] w-[2.91vw] mb-1 flex items-center justify-center bg-gray-200 rounded-[520.78vw]'>
            <Image
              alt='Zwilt Tracker Icon'
              src={MailLogo}
              width={100}
              height={100}
            />
          </div>
          <p
            className='font-semibold'
            style={{
              fontFamily: "Switzer",
              fontSize: "0.83vw",
              fontWeight: 500,
              color: "#282833",
            }}
          >
            Mail
          </p>
        </div>

        <div
          onClick={() => {
            handleNavigation(getMailDomain);
          }}
          className='flex flex-col items-center justify-center hover:bg-[#F4F4FA] mt-[0.2vw] h-[6vw] rounded-[1.042vw] cursor-pointer'
        >
          <div className='h-[2.91vw] w-[2.91vw] mb-1 flex items-center justify-center bg-gray-200 rounded-[520.78vw]'>
            <Image
              alt='Zwilt Tracker Icon'
              src={ZwiltTracker2}
              width={100}
              height={100}
            />
          </div>
          <p
            className='font-semibold'
            style={{
              fontFamily: "Switzer",
              fontSize: "0.83vw",
              fontWeight: 500,
              color: "#282833",
            }}
          >
            Punch
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDataDropDown;
