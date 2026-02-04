import React, { useState } from "react";
import { motion } from "framer-motion";
import { switchType } from "@/types/GeneralType";
import { useRecoilState } from "recoil";
import { isAuthenticated } from "../../utils/recoil_store/atoms/security-atom";
import useUser from "utils/recoil_store/hooks/use-user-state";

import { useMutation } from "@apollo/client";
import { DISABLE_2FA, ENABLE_2FA, } from "@/graphql/mutations/settings";
import { notifyErrorFxn, notifySuccessFxn } from "utils/toast-fxn";


const SwitchCustomStyle: React.FC<switchType> = ({
  isToggled,
  setIsToggled,
  setActive,
}) => {
  // const [isToggled, setIsToggled] = useRecoilState(isAuthenticated);
  const { userState: userProp, updateUser:updateUser } = useUser();
  const userState = userProp?.currentUser?.user;

  // Disable 2FA
  const [disableTwoFactor] = useMutation(DISABLE_2FA, {
    onCompleted: (data) => {
      if (data?.disableTwoFactor) {
        // Update local state after successful backend update
        const updatedUser = userProp instanceof Object ? { ...userProp } : {};
        if (updatedUser?.currentUser?.user instanceof Object) {
          updatedUser.currentUser = { ...updatedUser.currentUser }; // Copy currentUser
          updatedUser.currentUser.user = {
            ...updatedUser.currentUser.user, // Copy user
            isTwoFactorEnabled: false,      // Update the specific field
          };
        }
        updateUser(updatedUser);
        notifySuccessFxn("Two-Factor Authentication disabled successfully");
      }
    },
    onError: (error) => {
      console.log(error.message)
      notifyErrorFxn(error.message);
      // Revert toggle if mutation fails
      setIsToggled?.(true)
    }
  });

  // Enable 2FA
  const [enableTwoFactor] = useMutation(ENABLE_2FA, {
    onCompleted: (data: { enableTwoFactor: boolean }) => {
      if (data?.enableTwoFactor === true) {
        const updatedUser = userProp instanceof Object ? { ...userProp } : {};
        if (updatedUser?.currentUser?.user instanceof Object) {
          updatedUser.currentUser = { ...updatedUser.currentUser }; // Copy currentUser
          updatedUser.currentUser.user = {
            ...updatedUser.currentUser.user, // Copy user
            isTwoFactorEnabled: true,      // Update the specific field
          };
        }
        updateUser(updatedUser);
        notifySuccessFxn("Two-Factor Authentication enabled successfully");
      }
    },
    onError: (error) => {
      notifyErrorFxn(error.message);
      setIsToggled?.(false);
    }
  });

  // Function to toggle 2FA
  const handleToggle = () => {
    console.log(userState?.isTwoFactorEnabled)
    if (userState?.isTwoFactorEnabled) {
      disableTwoFactorAuthentication();
    } else {
      enableTwoFactorAuthentication();
    }

  };

  const enableTwoFactorAuthentication = () => {
    console.log("Enabling 2FA...");
    if(!userState?.isPhoneTwoFactorEnabled && !userState?.isAuthenticatorEnabled){
      setActive("Two Factor Authentication");
    }else {
      enableTwoFactor({
        variables: {
          type: "2fa"
        }
      });
      setIsToggled?.(true);
    }
  };
  
  const disableTwoFactorAuthentication = () => {
    console.log("Disabling 2FA...");
    setIsToggled?.(false);
    disableTwoFactor({
      variables: {
        type: "2fa"
      }
    });
  };
  
  return (
    <div onClick={handleToggle} className=''>
      <motion.div
        layout

        className={`w-8 h-4 sm:w-9 sm:h-5 md:w-10 md:h-5 rounded-full p-0.5 sm:p-0.5 md:px-[0.24vw] md:py-[0.4vh] cursor-pointer flex items-center ${
           userState?.isTwoFactorEnabled? "bg-[#50589F]" : "bg-gray-300"

        }`}
      >
        <motion.div

          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-white  ${
            userState?.isTwoFactorEnabled? "translate-x-40 sm:translate-x-44 md:translate-x-36" : ""
          }`}
          animate={{ x: userState?.isTwoFactorEnabled? "100%" : 0 }}

          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </div>
  );
};

export default SwitchCustomStyle;
