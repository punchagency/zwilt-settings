import React from "react";
import Image from "next/image";
import { OrganizationMember } from "../manageteam-role/user.interface";
import ProfileAvatar from "@/components/profileAvatar/ProfileAvatar";

interface DeleteTeamProps {
  userToDelete: any;
  // onDeleteTeamMember: () => void;
  handleDeleteMember: () => void;
  handleCloseModal: () => void;
}

const DeleteTeamModal: React.FC<DeleteTeamProps> = ({
  userToDelete,
  // onDeleteTeamMember,
  handleDeleteMember,
  handleCloseModal,
}) => {
  // Handle click outside the modal
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };
  return (
    <section
      className="flex items-center justify-center fixed max-w-full w-[100vw] h-screen left-0 top-0 bg-[#28283333] z-50"
      //  onClick={handleContainerClick}
    >
      <div className="p-[1.04vw_1.20vw_0.98vw] h-fit absolute w-[16.82vw] bg-[#ffffff] rounded-[1.04vw] z-10">
        {userToDelete && (
          <div className="flex flex-col items-center justify-center p-0 space-y-[1.04vw] w-full">
            <ProfileAvatar
              name={userToDelete.name}
              imageUrl={userToDelete.profile_img}
              size="2.60vw"
            />
            <div className="flex flex-col items-center p-0 space-y-[0.26vw] w-full">
              <h3 className="text-[#282833] font-semibold text-[1.25vw] leading-[1.67vw] text-center">
                Delete This User
              </h3>
              <p className="font-normal text-[0.73vw] leading-[0.94vw] text-center text-[#667085]">
                Are you sure you want to delete this user? Once deleted, you
                have to add them again.
              </p>
            </div>
          </div>
        )}
        <div className="w-full mt-[1.56vw] space-x-[0.52vw] flex items-center justify-center">
          <span
            onClick={handleCloseModal}
            className="flex justify-center items-center p-[0.52vw_1.25vw] text-[#696970] text-[0.94vw] outline-none font-normal w-full h-[2.08vw] bg-[#ffffff] border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer hover:bg-[#f4f4fa] hover:border-[#b8b8cd] hover:text-very-dark-grayish-blue"
          >
            No
          </span>
          <button
            onClick={handleDeleteMember}
            className="flex justify-center items-center p-[0.52vw_1.25vw] text-[#ffffff] text-[0.94vw] outline-none font-normal w-full h-[2.08vw] bg-[#50589F] border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer hover:bg-[#42498B]"
          >
            Yes
          </button>
        </div>
      </div>
    </section>
  );
};

export default DeleteTeamModal;
