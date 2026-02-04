import { cardProp } from "@/types/GeneralType";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { VERIFY_2FA } from "@/graphql/mutations/settings";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { secretVar } from "./state/index";
import { userIdVar } from "@/components/security/state";
import { ClipLoader } from "react-spinners";
// import getUSerDetails from '@/hooks/get-temp-user';
import { notifyErrorFxn, notifySuccessFxn } from "../../../utils/toast-fxn";
import useUser from "utils/recoil_store/hooks/use-user-state";

const CompleteAuthentication: React.FC<cardProp> = ({
  setOpenCard,
  setVerifyOpen,
  head,
  text,
  setVerified,
  setItemVerified,
  item,
}) => {
  // const secret = useReactiveVar(secretVar);
  // const {tempUserData} = getUSerDetails()
  //const userId = useReactiveVar(userIdVar);
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState("");
  // const { userState } = useUser();
  const { userState: userProp, updateUser } = useUser();
  console.log({ userProp });
  const userState = userProp?.currentUser?.user;

  const [verify2FA, { loading }] = useMutation(VERIFY_2FA, {
    onCompleted: (data) => {
      console.log({ data });
      if (data?.verifyTwoFactorCode) {
        notifySuccessFxn("verified");
        let user = userProp instanceof Object ? { ...userProp } : {};
        if (user?.currentUser?.user instanceof Object) {
          user.currentUser = { ...user.currentUser };
          user.currentUser.user = {
            ...user.currentUser.user,
            isAuthenticatorEnabled: true,
            isTwoFactorEnabled: true,
          };
          console.log({ user });

          updateUser(user);
        }
        setOpenCard(false);
        setVerifyOpen(false);
      } else {
        notifyErrorFxn("Not verified");
      }
    },
    onError: (error) => {
      console.log({ message: error.message });
      notifyErrorFxn(error.message);
    },
  });
  // console.log(userId)

  function complete() {
    setOpenCard(false);
    setVerifyOpen(false);
    setVerified(true);
    setItemVerified(item);
    secretVar(null);
  }
  //  console.log(tempUserData)

  const handleClick = () => {
    verify2FA({
      variables: {
        token: code,
        userId: userState?._id,
      },
    });
  };

  return (
    <div
      className={` "flex"  flex-col gap-[4vh]  bg-white h-fit w-[32vw] z-50 py-[1.6vh] px-[0.83vw] text-[#282833] rounded-[1.56vw] shadow-lg`}
    >
      <div className=' flex flex-col gap-[0.8vh] pb-[1.6vh]'>
        <div className=' flex justify-between items-center'>
          <p className='font-[600] text-[1.25vw]'> {head}</p>
          <div
            onClick={() => setOpenCard(false)}
            className='cursor-pointer border border-[#E0E0E9] w-fit rounded-[0.63vw] py-[0.8vh] px-[0.42vw] text-[0.83vw] hover:border-[#B8B8CD] hover:bg-[#F4F4FA]'
          >
            <IoMdClose />
          </div>
        </div>
        <div>
          <p className='text-[0.83vw] font-[400] w-[16vw] text-[#667085]'>
            {text}
          </p>
        </div>
      </div>

      <div>
        <input
          onChange={(e) => setCode(e.target.value)}
          type='text'
          className='h-[5vh] border boder-[#E0E0E9] w-full px-[0.83vw] rounded-[0.63vw] outline-none text-[0.83vw]'
        />
      </div>

      <div className='grid grid-cols-2 gap-[1.6vh] pt-[1.6vh]'>
        <div
          onClick={() => setVerifyOpen(false)}
          className='cursor-pointer h-[5vh] border border-[#E0E0E9] rounded-[0.78vw] flex items-center justify-center text-[0.93vw] hover:border-[#B8B8CD] hover:bg-[#F4F4FA]'
        >
          Back
        </div>
        <div
          onClick={handleClick}
          className='cursor-pointer h-[5vh] border bg-[#50589F] hover-button text-white rounded-[0.78vw] flex items-center justify-center text-[0.83vw] '
        >
          {loading ? (
            <span className='flex items-center'>
              <ClipLoader color='white' size={"2.4vh"} />
            </span>
          ) : (
            "Verify"
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteAuthentication;
