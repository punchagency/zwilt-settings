import React, { useState } from "react";
import { motion } from "framer-motion";
import { switchType } from "@/types/GeneralType";
import { useRecoilState } from "recoil";
import { isAuthenticated } from "../../utils/recoil_store/atoms/security-atom";
import useUser from "utils/recoil_store/hooks/use-user-state";

import { useMutation } from "@apollo/client";
import { DISABLE_2FA, ENABLE_2FA } from "@/graphql/mutations/settings";
import { notifyErrorFxn, notifySuccessFxn } from "utils/toast-fxn";

const SwitchCustomStyle: React.FC<switchType> = ({
  isToggled,
  setIsToggled,
  setActive,
}) => {
  // const [isToggled, setIsToggled] = useRecoilState(isAuthenticated);
  const { userState: userProp, updateUser: updateUser } = useUser();
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
            isTwoFactorEnabled: false, // Update the specific field
          };
        }
        updateUser(updatedUser);
        notifySuccessFxn("Two-Factor Authentication disabled successfully");
      }
    },
    onError: (error) => {
      console.log(error.message);
      notifyErrorFxn(error.message);
      // Revert toggle if mutation fails
      setIsToggled?.(true);
    },
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
            isTwoFactorEnabled: true, // Update the specific field
          };
        }
        updateUser(updatedUser);
        notifySuccessFxn("Two-Factor Authentication enabled successfully");
      }
    },
    onError: (error) => {
      notifyErrorFxn(error.message);
      setIsToggled?.(false);
    },
  });

  // Function to toggle 2FA
  const handleToggle = () => {
    console.log(userState?.isTwoFactorEnabled);
    if (userState?.isTwoFactorEnabled) {
      disableTwoFactorAuthentication();
    } else {
      enableTwoFactorAuthentication();
    }
  };

  const enableTwoFactorAuthentication = () => {
    console.log("Enabling 2FA...");
    if (
      !userState?.isPhoneTwoFactorEnabled &&
      !userState?.isAuthenticatorEnabled
    ) {
      setActive("Two Factor Authentication");
    } else {
      enableTwoFactor({
        variables: {
          type: "2fa",
        },
      });
      setIsToggled?.(true);
    }
  };

  const disableTwoFactorAuthentication = () => {
    console.log("Disabling 2FA...");
    setIsToggled?.(false);
    disableTwoFactor({
      variables: {
        type: "2fa",
      },
    });
  };

  return (
    <div onClick={handleToggle} className="">
      <motion.div
        layout
        className={`w-11 h-6 rounded-full p-[2px] cursor-pointer flex items-center transition-colors duration-200 ${
          userState?.isTwoFactorEnabled ? "bg-[#34C759]" : "bg-[#E9E9EA]"
        }`}
      >
        <motion.div
          className="w-5 h-5 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
          layout
          transition={{ type: "spring", stiffness: 700, damping: 35 }}
          animate={{ x: userState?.isTwoFactorEnabled ? 20 : 0 }}
        />
      </motion.div>
    </div>
  );
};

export default SwitchCustomStyle;
