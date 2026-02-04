import { useRecoilState } from "recoil";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { popoverState } from "../../../utils/recoil_store/atoms/toolsAtom";
interface ModalProps {
  // isOpen: boolean;
  openDelete: () => void;
  openEdit: () => void;
}
const Popover: React.FC<ModalProps> = ({ openDelete, openEdit }) => {
  const [popover, setPopover] = useRecoilState(popoverState);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (popover.visible) {
      const el = document.querySelector(`[data-url="${popover.url}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        setPosition({
          top: rect.top + window.scrollY + rect.height - 10,
          left: rect.left + window.scrollX - 110, // Move the popover to the left
        });
      }
    }
  }, [popover]);

  console.log(popover.url, "popover.url");

  const handleMouseEnter = () => {
    setPopover((prev) => ({ ...prev, visible: true }));
  };

  const handleMouseLeave = () => {
    setPopover( (prev) => ({...prev, visible: false }));
  };

  useEffect(() => {
    const handleMouseEnterPopover = () => {
      setPopover((prev) => ({ ...prev, visible: true }));
    };

    const handleMouseLeavePopover = () => {
      setPopover( (prev) => ({...prev, visible: false }));
    };

    const popoverElement = popoverRef.current;
    if (popoverElement) {
      popoverElement.addEventListener("mouseenter", handleMouseEnterPopover);
      popoverElement.addEventListener("mouseleave", handleMouseLeavePopover);
    }

    return () => {
      if (popoverElement) {
        popoverElement.removeEventListener(
          "mouseenter",
          handleMouseEnterPopover
        );
        popoverElement.removeEventListener(
          "mouseleave",
          handleMouseLeavePopover
        );
      }
    };
  }, [popoverRef, setPopover]);

  if (!popover.visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, transformOrigin: "top right" }}
      animate={{ opacity: 1, scale: 1, transformOrigin: "top right" }}
      exit={{ opacity: 0, scale: 0.5, transformOrigin: "top right" }}
      style={{ top: position.top, left: position.left }}
      className=" top-0 z-50 w-[5.73vw]  h-[5.21vw] bg-white  rounded-[0.83vw] drop-shadow-md p-[0.416vw] flex items-center flex-col justify-between"
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
    >
      <div
        className="px-[0.83vw] py-[0.416vw] w-full  text-gray-700 hover:bg-gray-100 cursor-pointer rounded-[0.625vw] text-[0.83vw] flex"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          // setPopover((prev) => ({ ...prev, visible: false }));
          openEdit();
          handleMouseLeave();
        }}
      >
        Edit
      </div>
      <div
        className="px-[0.83vw] py-[0.416vw]  text-gray-700 hover:bg-gray-100 cursor-pointer rounded-[0.625vw] text-[0.83vw] flex w-full"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          // setPopover((prev) => ({ ...prev, visible: false }));
          openDelete();
          handleMouseLeave();
        }}
      >
        Delete
      </div>
    </motion.div>
  );
};

export default Popover;
