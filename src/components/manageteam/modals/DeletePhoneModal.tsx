import React from "react";
import Image from "next/image";
import PhoneIcon from "./PhoneIcon";

interface DeletePhoneProps {
  phoneNumber: string;
  onDeletePhone: () => void;
  handleCloseModal: () => void;
}

const DeletePhoneModal: React.FC<DeletePhoneProps> = ({
  phoneNumber,
  onDeletePhone,
  handleCloseModal,
}) => {
  return (
    <section className="flex items-center justify-center fixed max-w-full w-[100vw] h-screen left-0 top-0 bg-[#28283333] z-50">
      <div className="p-[1.04vw_1.20vw_0.98vw] h-fit absolute w-[16.82vw] bg-[#ffffff] rounded-[1.04vw] z-10">
        <div className="flex flex-col items-center justify-center p-0 space-y-[1.04vw] w-full">
          <div className="flex flex-col items-center p-0 space-y-[0.66vw] w-full">
            <PhoneIcon  />
            <p className="font-semibold text-[1.25vw]  leading-[1.67vw] text-center mt-48">
            {phoneNumber}
            </p>
            <p className="font-normal text-[0.73vw] leading-[0.94vw] text-center text-[#667085]">
              Are you sure you want to delete this contact number?
            </p>
          </div>
        </div>
        <div className="w-full mt-[1.56vw] space-x-[0.52vw] flex items-center justify-center">
          <span
            onClick={handleCloseModal}
            className="flex justify-center items-center p-[0.52vw_1.25vw] text-[#696970] text-[0.94vw] outline-none font-normal w-full h-[2.08vw] bg-[#ffffff] border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer hover:bg-[#f4f4fa] hover:border-[#b8b8cd] hover:text-very-dark-grayish-blue"
          >
            No
          </span>
          <button
            onClick={onDeletePhone}
            className="flex justify-center items-center p-[0.52vw_1.25vw] text-[#ffffff] text-[0.94vw] outline-none font-normal w-full h-[2.08vw] bg-[#50589F] border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer hover:bg-[#42498B]"
          >
            Yes
          </button>
        </div>
      </div>
    </section>
  );
};

export default DeletePhoneModal;