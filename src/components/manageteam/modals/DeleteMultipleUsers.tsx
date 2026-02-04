import React from "react";

interface DeleteMultipleAdminProps {
  selectedUserCount: number;
  handleCloseModal: () => void;
  onDeleteTeamMember: () => void;
}

const DeleteMultipleUsers: React.FC<DeleteMultipleAdminProps> = ({
  selectedUserCount,
  handleCloseModal,
  onDeleteTeamMember,
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
      // onClick={handleContainerClick}
    >
      <div className="p-[1.04vw_1.20vw_0.98vw] h-fit absolute w-[16.82vw] bg-[#ffffff] rounded-[1.04vw] z-10">
        <div className="flex flex-col items-center justify-center p-0 space-y-[1.56vw] w-full">
          <div className="flex justify-center items-center p-[0.52vw_0.78vw] space-x-[0.52vw] border border-[#e0e0e9] rounded-[1.56vw]">
            <h4 className="font-semibold text-[0.73vw] leading-[0.94vw] text-center text-[#282833]">
              {selectedUserCount} User{selectedUserCount > 1 ? "s" : ""}{" "}
              Selected
            </h4>
          </div>

          <div className="flex flex-col items-center p-0 space-y-[0.26vw] w-full">
            <h3 className="text-[#282833] font-semibold leading-[1.67vw] text-center">
              Delete This User
            </h3>
            <p className="font-normal text-[0.73vw] leading-[0.94vw] text-center text-[#667085]">
              Are you sure you want to delete the selected user
              {selectedUserCount > 1 ? "s" : ""}? Once these deleted, you have
              to add it again.
            </p>
          </div>
        </div>

        <div className="w-full mt-[1.56vw] space-x-[0.52vw] flex items-center justify-center">
          <span
            onClick={handleCloseModal}
            className="flex justify-center items-center p-[0.52vw_1.25vw] text-[#282833B2] text-[0.94vw] font-normal w-full h-[2.08vw] bg-[#ffffff] border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer hover:bg-[#f4f4fa] hover:border-[#b8b8cd] hover:text-very-dark-grayish-blue"
          >
            No
          </span>
          <button
            onClick={onDeleteTeamMember}
            className="flex justify-center items-center p-[0.52vw_1.25vw] w-full h-[2.08vw] bg-[#50589F] text-[#ffffff] text-[0.94vw] font-normal border border-solid border-[#e0e0e9] rounded-[0.78vw] grow cursor-pointer hover:bg-[#42498B]"
          >
            Yes
          </button>
        </div>
      </div>
    </section>
  );
};

export default DeleteMultipleUsers;
