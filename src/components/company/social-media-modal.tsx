"use client";

import { FC, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { popoverState } from "../../../utils/recoil_store/atoms/toolsAtom";
import Close from "@/assests/icons/close.svg";
import { useLinksState } from "../../../utils/recoil_store/hooks/use-link-state";
import { notifyErrorFxn, notifySuccessFxn } from "../../../utils/toast-fxn";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {};

const SocialMediaModal: FC<ModalProps> = ({ isOpen, onClose }) => {
  const [popover, setPopover] = useRecoilState(popoverState);
  const [currentValue, setCurrentValue] = useState(popover.url);
  const { setLinks } = useLinksState();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set the current value to the popover URL when editing
    setCurrentValue(popover.url);
    
    // Focus and select the input text when modal opens for editing
    if (popover.url && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [popover.url]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(event.target.value);
  };

  function extractDomain(input: string) {
    // Remove 'www.' if present
    let sanitizedInput = input.replace(/^www\./, '');
  
    // Match the domain name before the next '.'
    let match = sanitizedInput.match(/^([^\.]+)/);
  
    // Return the matched domain or an empty string if no match is found
    return match ? match[0] : '';
  }

  const updateLink = () => {
    const trimmedUrl = currentValue.replace(/^https?:\/\//, "");
    const updatedLink: any = {
      socialLink: trimmedUrl,
      socialType: extractDomain(trimmedUrl),
    };
  
    // Check if the link to be updated exists in the list
    setLinks((prevLinks) => {
      const linkIndex = prevLinks.findIndex(
        (link) => link.socialLink === popover.url // Match the original URL stored in popover
      );
  
      if (linkIndex === -1) {
        notifyErrorFxn("The selected link does not exist in the list.");
        return prevLinks; // Return without changes if not found
      }
  
      // Create a new array to avoid mutating the original state directly
      const updatedLinks = prevLinks.map((link, index) => 
        index === linkIndex ? updatedLink : link
      );
  
      notifySuccessFxn("Link updated successfully!");
      return updatedLinks; // Return the updated list
    });
  };

  const addNewLink = () => {
    const trimmedUrl = currentValue.replace(/^https?:\/\//, "");
    const newLink: any = {
      socialLink: trimmedUrl,
      socialType: extractDomain(trimmedUrl),
    };
  
    // Check if the new link already exists in the list
    setLinks((prevLinks) => {
      const linkExists = prevLinks.some(
        (link) => link.socialLink === newLink.socialLink
      );
  
      if (linkExists) {
        notifyErrorFxn("This link already exists in the list.");
        return prevLinks; // Do not add the link if it already exists
      }
  
      notifySuccessFxn("Adding new link:");
      return [...prevLinks, newLink]; // Add the new link
    });
  };

  const handleAddClick = () => {
    const urlPattern = new RegExp(
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    if (urlPattern.test(currentValue) && currentValue.includes(".")) {
      popover.url !== "" ? updateLink(): addNewLink()
      onClose();
      setPopover({ visible: false, url: "" });
      setCurrentValue("");
    } else {
      notifyErrorFxn("Invalid URL");
    }
  };

  const handleClose = () => {
    onClose();
    setPopover({ visible: false, url: "" });
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
        className="bg-white p-[0.83vw] rounded-[1.25vw] shadow-lg w-[27.08vw]"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[1.0417vw] font-semibold mb-[0.201vw] text-[#282833]">
            Add company&apos;s social profile
          </h2>
           <a
            onClick={onClose}
            className="flex items-center justify-center p-0 gap-[0.21vw] isolate w-[2.08vw] h-[2.08vw] bg-[#ffffff] border-[0.04vw] border-solid border-[#e0e0e9] rounded-[0.63vw] cursor-pointer hover:bg-[#f4f4fa] hover:border-[#b8b8cd]"
          >
            <Image
              src={Close}
              className="text-[#282833] w-[0.83vw] h-[0.83vw]"
              width={16}
              alt=""
            />
          </a>
        </div>
        <div className="mt-[1.25vw] w-full">
          <div className="w-full mt-[1.25vw]">
            <label className="block mb-[0.417vw] font-600 text-[0.93vw]">Paste Link Here</label>
            <input
              ref={inputRef}
              type="text"
              placeholder="https://www.linkedin.com/in/zion-sky"
              value={currentValue}
              onChange={(event) => handleInputChange(event)}
              className="w-full placeholder:font-light placeholder:text-[0.73vw] text-[0.83vw] hover:border-[#50589F] placeholder:text-gray-500 px-[0.83vw]  flex items-center h-[2.55vw] border-[#E0E0E9] border text-[#282833] rounded-[0.73vw] focus:outline-none"
            />
          </div>
        </div>
        <div className="flex gap-[0.83vw] justify-between w-full mt-[1.67vw]">
        <span
              className="flex justify-center items-center p-[0.52vw_1.25vw] hover:border-[#B8B8CD] text-[#696970] text-[0.94vw] font-normal w-full h-[2.60vw] bg-[#ffffff] border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer outline-none hover:bg-[#f4f4fa] hover:text-very-dark-grayish-blue"
              onClick={onClose}
            >
              Cancel
            </span>
          <span
            className="flex justify-center items-center p-[0.52vw_1.25vw] w-full h-[2.60vw] bg-[#50589F] text-[#ffffff] text-[0.94vw] font-normal border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer outline-none hover:bg-[#42498B]"
            onClick={handleAddClick}
          >
            {popover.url ? "Update" : "Add"}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SocialMediaModal;