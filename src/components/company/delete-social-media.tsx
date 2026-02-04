"use client";

import { FC, useState } from "react";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import {
  linksState,
  popoverState,
} from "../../../utils/recoil_store/atoms/toolsAtom";
import { useLinksState } from "../../../utils/recoil_store/hooks/use-link-state";
import { useMutation } from "@apollo/client";
import { CgSpinner } from "react-icons/cg";
import { updateCompanyProfile } from "@/graphql/mutations/company";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  // hidden: { opacity: 0, y: "-100vh" },
  // visible: { opacity: 1, y: "0" },
};

const DeleteSocialMediaLink: FC<ModalProps> = ({ isOpen, onClose }) => {
  const [popover, setPopover] = useRecoilState(popoverState);
  const [updateCoyProfile, { loading }] = useMutation(updateCompanyProfile, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
    const { links, deleteLink } = useLinksState();

  const handleDelete = () => {
    deleteLink(popover.url);
    updateCoyProfile({
      variables: {
        input: {
          socialMedia: links,
        },
      },
    });
    if (!loading) {

      onClose();
      setPopover({ visible: false, url: "" });
    }
  };
  const handleClose = () => {
    setPopover({ visible: false, url: "" });
    onClose();
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
        className="bg-white p-[0.83vw] rounded-[1.25vw] shadow-lg  w-[20vw]"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="flex items-center justify-center">
          <h2 className="text-[0.93vw] font-semibold  text-[#282833]">
            Delete company&apos;s social link
          </h2>
        </div>
        <div className="my-[0.83vw] w-full  py-[0.625vw] rounded-[0.83vw] text-center">
          <p className=" border-[#E0E0E9] border p-[0.417vw] rounded-[0.625vw] mb-[0.417vw] ">
            <span className="truncate w-60 text-[#667085] text-[0.83vw]">
              {popover.url}
            </span>
          </p>
          <p className="text-[#667085] text-[0.73vw]">
            Are you sure you want to delete the selected social media link?
          </p>
        </div>
        <div className="flex gap-[0.83vw] justify-between w-full ">
          <span
            className="bg-white px-[0.83vw] py-[0.416vw] w-full border text-center hover:bg-[#f4f4fa] border-gray-200 text rounded-[0.625vw] cursor-pointer text-[#282833] text-opacity-[70%] hover:text-opacity-[100%] text-[0.73vw] font-500"
            onClick={handleClose}
          >
            No
          </span>
          <span
            className="bg-[#50589F] hover:bg-[#444ea9] text-white text-center px-[0.83vw] py-[0.416vw] rounded-[0.625vw] text-[0.73vw] font-500 cursor-pointer w-full"
            onClick={handleDelete}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <CgSpinner className="animate-spin" size={20} />
              </span>
            ) : (
              "Yes"
            )}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteSocialMediaLink;
