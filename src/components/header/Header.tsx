import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
//import Navs from "@/components/navs/subcomponent/enviromentalnav";

// import GroupIcon from "@/assests/icons/groupicon.png";
import GroupIcon from "@/assests/icons/groupicon.svg";
import GetDomains from "@/containers/domains/GetDomains";
import useAuth from "@/hooks/useAuth";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUser from "../../../utils/recoil_store/hooks/use-user-state";
import GeneralSearchBar from "../../containers/search-container/GeneralSearchBar";
import ChatBox from "../ChatBox";
import HeaderLogo from "./HeaderLogo";
import ProfileContent from "./ProfileContent";
import ProfileDetail from "./ProfileDetail";
import UserDataDropDown from "./userDataDropDown";
import NotificationBox from "../NotificationBox";
import { calculatePxToPercentage } from "../ChatBox/styled";
import MenuBox from "../MenuBox/MenuBox";


interface UserData {
  profilePic: string;
  name: string;
  email: string;
  managedBy: string;
  accountSettings: JSX.Element;
  logout: JSX.Element;
}

const Header: React.FC = () => {
  // const { userState } = useUser();
  const { handleLogout, showSuccessMessage } = useAuth();
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [showuserData, setShowuserData] = useState(false);
  const profileRef = useRef<HTMLButtonElement | null>(null);
  const userProfileRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLButtonElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const [rotated, setRotated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { userState: userProp } = useUser();
  const userState = userProp?.currentUser;
  const [isFocus, setIsFocus] = useState(false);
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);

  const {
    StoreDomain,
    getTrackerApp,
    getRecrowdlyAppDomain,
    getSalesAppDomain,
    getMailDomain,
  } = GetDomains();

  const handleSearch = () => {
    console.log(`Searching for: ${searchQuery}`);
    // Add search functionality here : Required API Call
  };

  const handleClose = () => {
    setIsFocus(false);
    setSearchQuery("");
  };

  // Adding the event listener to detect clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node) &&
        userProfileRef.current &&
        !userProfileRef.current.contains(event.target as Node)
      ) {
        setShowProfileDetails(false); // Close the profile form
        setRotated(false);
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        groupRef.current &&
        !groupRef.current.contains(event.target as Node)
      ) {
        setShowuserData(false); // Close the user data dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProfileDetails = () => {
    setRotated(!rotated);
    setShowProfileDetails((prevState) => !prevState);

    if (showuserData) {
      setShowuserData(false);
    }
  };

  const toggleUserData = () => {
    setShowuserData((prevState) => !prevState);

    if (showProfileDetails) {
      setShowProfileDetails(false);
    }
    setRotated(false);
  };

  const handleNavigation = (goto: any) => {
    const domain = goto();
    if (domain) {
      window.open(domain, "_blank", "noopener,noreferrer"); // Navigate to the returned domain
    } else {
      console.error("Invalid domain");
    }
  };
  return (
    <div className='w-full flex items-center justify-center py-[0.73vw] px-[0.83vw]'>
      <div 
        className='py-[0.78vw] w-[93.75vw] items-center justify-center flex rounded-[1.5625vw] bg-white' 
        style={{ 
          zIndex: 997,
          opacity: isAnyModalOpen ? "0.05" : "1",
          transition: "opacity 0.2s ease-in-out",
          pointerEvents: isAnyModalOpen ? "none" : "auto" // Disable interactions when modal is open
        }}
      >
        <HeaderLogo />

        <div style={{ height: "3.125vw", flex: 1 }}>
          <GeneralSearchBar
            isFocus={isFocus}
            setIsFocus={setIsFocus}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        <div 
          className='flex px-4' 
          style={{ 
            width: "auto", 
            position: "relative", 
            zIndex: 997,
            opacity: isAnyModalOpen ? "0.05" : "1",
            transition: "opacity 0.2s ease-in-out",
            pointerEvents: isAnyModalOpen ? "none" : "auto" // Disable interactions when modal is open
          }}
        >
          <div className='ml-[0.44vw]'>
            <ChatBox />
          </div>

          <div className='ml-[0.44vw]'>
            <NotificationBox />
          </div>

          {/* Profile details as button */}

          <ProfileDetail
            profileRef={profileRef}
            toggleProfileDetails={toggleProfileDetails}
            userState={userState}
            rotated={rotated}
          />

          {/* Profile details display */}
          {showProfileDetails && (
            <ProfileContent
              userProfileRef={userProfileRef}
              userState={userState}
              handleLogout={handleLogout}
            />
          )}

          <button
            ref={dropdownRef}
            onClick={toggleUserData}
            className="w-[3.13vw] h-[3.13vw] ml-[0.44vw] flex items-center justify-center border border-[#E0E0E9] rounded-[0.94vw] p-[0.78vw]  hover:bg-[#F4F4FA] hover:border hover:border-[#B8B8CD]"
          >
            <MenuBox />
          </button>

          {/* User data dropdown */}
          {showuserData && (
            <UserDataDropDown
              groupRef={groupRef}
              handleNavigation={handleNavigation}
            />
          )}

          {/* Success message */}
          {showSuccessMessage && (
            <div className='absolute right-[0] top-[6.66vw] mr-[3.63vw] w-[15vw] bg-green-500 border border-gray-300 rounded-[0.7vw] z-[10] p-[0.83vw] text-white shadow-custom  overflow-visible'>
              <div className='flex items-center space-x-2'>
                <FontAwesomeIcon icon={faCheckCircle} className='text-white' />
                <p className='text-sm'>Logout Successful!</p>
              </div>
            </div>
          )}
        </div>
        {/* </div> */}
        {/* </header> */}
      </div>
    </div>
  );
};

export default Header;
