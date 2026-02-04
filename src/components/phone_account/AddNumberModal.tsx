import { FC } from "react";
import { motion } from "framer-motion";
import { CityOption } from "./AddPhoneModal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityOption | null;
  handleAssign: () => void;
}

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  // hidden: { opacity: 0, y: "-100vh" },
  // visible: { opacity: 1, y: "0" },
};

const Modal: FC<ModalProps> = ({ isOpen, onClose, city, handleAssign }) => {
  if (!isOpen || !city) return null;

  return (
    <motion.div
      className="flex items-center justify-center fixed max-w-full w-[100vw] h-screen left-0 top-0 bg-[#28283333] z-100"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="flex flex-col items-center justify-center p-[1.35vw_1.09vw_1.15vw_1.09vw] absolute w-[26.98vw] h-fit rounded-[1.56vw] bg-[#ffffff] z-10"
        style={modalStyle}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="w-full flex flex-col items-center justify-center">
          <div className="flex flex-col justify-center items-center leading-normal">
            <h2 className="text-[2.19vw] font-medium text-[#282833]">
              {city.number}
            </h2>
            <p className="text-[#282833] text-[0.83vw] font-normal">
              {city.city}
            </p>
          </div>

          <p className="text-[#282833] text-[0.83vw] font-normal w-[21.77vw] text-center mt-[1.45vw]">
            By adding this number to your workspace account you will be charged
            an amount of <strong>${0}/month</strong>. Are you sure you want to
            continue?
          </p>
        </div>

        <div className="flex gap-[1.04vw] justify-between mt-[1.92vw] w-full">
          <span
            className="flex justify-center items-center p-[0.52vw_1.25vw] hover:border-[#B8B8CD] text-[#696970] text-[0.94vw] font-normal w-full h-[2.60vw] bg-[#ffffff] border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer outline-none hover:bg-[#f4f4fa] hover:border-[#b8b8cd] hover:text-very-dark-grayish-blue"
            onClick={onClose}
          >
            Cancel
          </span>
          <span
            onClick={handleAssign}
            className="flex justify-center items-center p-[0.52vw_1.25vw] w-full h-[2.60vw] bg-[#50589F] text-[#ffffff] text-[0.94vw] font-normal border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer outline-none hover:bg-[#42498B]"
          >
            Add Number
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;

const modalStyle: React.CSSProperties = {
  boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.1)",
};

const selectStyle: React.CSSProperties = {
  boxShadow: "0px 0px 20px rgba(80, 88, 159, 0.1)",
  zIndex: 1,
};
