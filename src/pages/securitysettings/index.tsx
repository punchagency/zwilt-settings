import BasicTabs from "@/components/security/BasicTabs";
import Basics from "@/components/security/Basics";
import TwoFactorAuth from "@/components/TwoFactorAuth";
import { generalSecurity } from "@/types/GeneralType";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { TempGetUser } from "@/graphql/queries/user";
import { useQuery, useReactiveVar } from "@apollo/react-hooks";
import {
  signedInDevicesVar,
  userIdVar,
  is2FAEnabledVar,
} from "@/components/security/state";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isAuthenticated } from "../../../utils/recoil_store/atoms/security-atom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseNumberCard from "@/components/cards/BaseNumberCard";
import BaseAuthCard from "@/components/cards/BaseAuthCard";
import { useRouter } from "next/router";
import useUser from "utils/recoil_store/hooks/use-user-state";

const Page: React.FC = ({}) => {
  const [openCard, setOpenCard] = useState<boolean>(false);
  const [verifyOpen, setVerifyOpen] = useState<boolean>(false);
  const [openAuthenticator, setOpenAuthenticator] = useState<boolean>(false);
  const [auth, setAuth] = useState(false);
  const [addAuth, setAddAuth] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [verifiedNumber, setVerifiedNumber] = useState<boolean>(false);
  const [verifiedAuthenticator, setVerifiedAuthenticator] = useState(false);
  const [numberVerified, setNumberVerified] = useState<string>("");
  const [authenticatorVerified, setAuthenticatorVerified] =
    useState<string>("");
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [active, setActive] = useState<string>("Basics");
  const [currentPassword, setCurrentPassword] =
    useState<string>("random password");
  const [user, setUser] = useState(null);
  const twoFAEnabled = useReactiveVar(is2FAEnabledVar);
  const [authVerified, setAuthVerified] = useRecoilState(isAuthenticated);

  //getting user data
  const { userState: userProp } = useUser();
  const userState = userProp?.currentUser;

  const router = useRouter();
  const { tab } = router.query;

  useEffect(() => {
    if (tab) {
      const tabMap = {
        basic: "Basics",
        "change-password": "Change Password",
        "two-factor-auth": "Two Factor Authentication",
      };
      setActive(tabMap[tab as keyof typeof tabMap] || "Basics");
    }
  }, [tab]);

  const {} = useQuery(TempGetUser, {
    onCompleted: (data) => {
      const user = userState?.user;
      setUser(user);
      userIdVar(user._id);
      is2FAEnabledVar(user.isTwoFactorEnabled);
      signedInDevicesVar(user.signedInDevices);
    },
  });

  // const {} = useQuery(TempGetUser, {
  //   onCompleted: (data) => {
  //     const isTwoFactorEnabled = userState?.user.isTwoFactorEnabled;

  //     setAuthVerified(isTwoFactorEnabled);
  //   },
  // });

  const { data, loading, error } = useQuery(TempGetUser, {
    onCompleted: () => {
      const isTwoFactorEnabled = userState?.user?.isTwoFactorEnabled;

      if (isTwoFactorEnabled !== undefined) {
        setAuthVerified(isTwoFactorEnabled);
      } else {
        console.error(
          "Unable to verify two-factor authentication status from userState."
        );
      }
    },
    onError: (error) => {
      console.error("Error fetching user data:", error);
    },
  });

  const array: { name: string; animate: boolean; link: string }[] = [
    {
      name: "Basics",
      animate: true,
      link: "basic",
    },
    {
      name: "Change Password",
      animate: true,
      link: "change-password",
    },
    {
      name: "Two Factor Authentication",
      animate: true, // Set this to false to make it unclickable
      link: "two-factor-auth",
    },
  ];

  return (
    <div className='flex flex-col gap-[1.25vw] h-[100%] overflow-hidden border-box'>
      <ToastContainer />
      <div className='px-[1.25vw] flex flex-col gap-[0.52vw]'>
        <p className='font-[600] text-[1.25vw] text-[#282833] leading-[1.64vw] -mb-[0.15vw]'>
          Password & Security
        </p>
        <p className=' font-normal text-[0.833vw] text-[#6F6F76]  leading-[1.1vw] -mb-[0.28vw] '>
          Manage your payment & billing information here.
        </p>
      </div>

      <div className='border flex gap-[1.67vw] px-[1.25vw] '>
        {array.map((item) => (
          <motion.div
            key={item.name}
            className={`py-[1.6vh]  relative ${
              !item.animate
                ? " cursor-not-allowed text-gray-400 "
                : "cursor-pointer"
            }`}
            onClick={() => {
              item.animate && setActive(item.name);
              router.push(`/securitysettings?tab=${item.link}`);
            }}
          >
            <p
              className={`${
                active === item.name
                  ? "text-[#282833] font-[600]"
                  : "text-gray-500"
              } hover:text-[#282833] text-[0.93vw] font-[500]`}
            >
              {item.name}
            </p>
            {active === item.name && (
              <motion.div
                layoutId='underline'
                className='absolute left-0 right-0 bottom-0 h-[2px] bg-[#282833]'
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className='Content h-[63vh] overflow-y-scroll scrollbar-thin'>
        <AnimatePresence mode='wait'>
          {active === "Basics" && (
            <motion.div
              key='Basics'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='w-[100%]'
            >
              <Basics
                currentPassword={currentPassword}
                setActive={setActive}
                isToggled={isToggled}
                setIsToggled={setIsToggled}
              />
            </motion.div>
          )}
          {active === "Change Password" && (
            <motion.div
              key='Change Password'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='w-[100%]'
            >
              <BasicTabs />
            </motion.div>
          )}
          {active === "Two Factor Authentication" && (
            <motion.div
              key='Two Factor Authentication'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='w-[100%]'
            >
              <TwoFactorAuth
                setOpenCard={setOpenCard}
                setOpenAuthenticator={setOpenAuthenticator}
                verifiedAuthenticator={verifiedAuthenticator}
                verifiedNumber={verifiedNumber}
                phone={phone}
                numberVerified={numberVerified}
                authenticatorVerified={authenticatorVerified}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BaseNumberCard
        openCard={openCard}
        verifyOpen={verifyOpen}
        setVerifyOpen={setVerifyOpen}
        setPhone={setPhone}
        phone={phone}
        setOpenCard={setOpenCard}
        setVerifiedNumber={setVerifiedNumber}
        setNumberVerified={setNumberVerified}
      />
      {/* authenticator pop up Cards */}
      <BaseAuthCard
        openAuthenticator={openAuthenticator}
        setOpenAuthenticator={setOpenAuthenticator}
        auth={auth}
        setAuth={setAuth}
        addAuth={addAuth}
        setAddAuth={setAddAuth}
        setAuthenticatorVerified={setAuthenticatorVerified}
        setVerifiedAuthenticator={setVerifiedAuthenticator}
      />
    </div>
  );
};

export default Page;
