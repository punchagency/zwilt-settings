"use client";
import { FC, useState } from "react";
import { motion } from "framer-motion";
// import { cities, CityOption } from "./AddPhoneModal";
// import CustomSelect from "./custom-select";
import { IoCloseOutline } from "react-icons/io5";
// import AutoComplete from "./auto-complete";
import { usePhoneInfo } from "@/store/phone-account-store";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { useMutation } from "@apollo/client";
import { DeleteMyAccount } from "@/graphql/mutations/user";
// import userImage from '@/assests/icons/user.svg'
import { notifyErrorFxn, notifySuccessFxn } from "../../../utils/toast-fxn";
import useUser from "utils/recoil_store/hooks/use-user-state";

interface TruncatedTextProps {
  text: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userImage: string;
  userEmail: string;
  role: string;
}

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  // hidden: { opacity: 0, y: "-100vh" },
  // visible: { opacity: 1, y: "0" },
};

const DeleteAccountModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  userImage,
  userName,
  role,
}) => {
  const City = usePhoneInfo((state) => state.selectedCity);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  //   const [data, setData] = useState<CityOption[]>(cities);
  const { userState } = useUser();

  const [password, setPassword] = useState("");

  const [deleteMyAccount] = useMutation(DeleteMyAccount, {
    onCompleted: () => {
      notifySuccessFxn("deleted successfully");
      onClose;
    },
    onError: (error) => {
      notifyErrorFxn(error.message);
    },
  });

  const handleDeleteUser = () => {
    if (password !== "") {
      deleteMyAccount({
        variables: {
          password: password,
        },
      });
    } else {
      notifyErrorFxn("please type password");
    }
  };

  const TruncatedText: React.FC<TruncatedTextProps> = ({ text }) => {
    const truncated = text.length > 10 ? `${text.substring(0, 6)}...` : text;

    return <span>{truncated}</span>;
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white p-[0.83vw] rounded-[1.042vw] shadow-lg w-[27.08vw] flex flex-col gap-[1.042vw]"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="flex  items-center w-full justify-center">
          <p className="text-[1.25vw] font-[600]  text-[#282833] text-center ">
            Delete My Account
          </p>

          {/* <div
            onClick={onClose}
           className="text-[0.83vw] text-[#282833] hover:bg-[#F4F4FA] opacity-[80%] hover:opacity-[100%] h-[2.083vw] w-[2.083vw] flex items-center border-[0.042vw] border-[#E0E0E9] hover:border-[#b4b4c8] justify-center rounded-[0.625vw] cursor-pointer">
              <IoMdClose />
          </div> */}
        </div>
        <div className="flex justify-between items-center py-[0.83vw] border-t-[0.052vw] border-b-[0.052vw] ">
          <div className="flex gap-[0.521vw] items-center">
            <Image
              src={userImage}
              width={50}
              height={50}
              alt="user image"
              className=" w-[2.6vw] h-[2.6vw] rounded-full"
            />
            <div className="font-[400] text-[0.83vw] ">
              <p>{userName}</p>
              <p className=" text-[#6F6F76]">{userEmail}</p>
            </div>
          </div>
          <div className="w-[3.854vw] h-[1.56vw] bg-[#F2F4F7] border-[0.052vw] border-[#EAECF0] font-[400] text-[0.73vw] text-[#98A2B3] flex items-center justify-center rounded-[2.6vw]">
            <TruncatedText text={role} />
          </div>
        </div>

        <div className="flex flex-col gap-[1.042vw] ">
          <div className="flex flex-col gap-[0.43vw]">
            <p className="font-[600] text-[0.93vw]">Confirm Password</p>
            <p className="font-[500] text-[0.73vw] text-[#6F6F76]">
              Complete the delete process by entering the password associate
              with you account
            </p>
          </div>
          <input
            placeholder="Enter Passsword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[25.05vw] h-[2.55vw] font-[500] placeholder:font-[500] text-[0.83vw] rounded-[0.781vw] border-[0.051vw] px-[0.83vw] outline-none hover:border-[#50589F] focus:border-[#50589F] border-[#E0E0E9] "
          />
        </div>

        <div className="flex gap-[0.83vw] justify-between  w-full mt-[0.83vw] ">
          <span
            className="bg-white px-[0.83vw] h-[2.604vw] flex justify-center items-center w-full text-[0.93vw] border-[0.05208vw] text-center  border-[#E0E0E9] hover:border-[#b4b4c8] rounded-[0.781vw] cursor-pointer text-[#282833B2] opacity-[70%] hover:opacity-[100%] hover:bg-[#F4F4FA] font-[500]"
            onClick={onClose}
          >
            Cancel
          </span>
          <span
            onClick={handleDeleteUser}
            className="bg-[#50589F] text-white text-center px-[0.83vw] rounded-[0.781vw] h-[2.604vw] flex justify-center items-center text-[0.93vw] font-[500] cursor-pointer hover:bg-[#3C448B] w-full"
          >
            Delete
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteAccountModal;
