import React, { useState } from "react";

const customActiveUnderlineStyle: React.CSSProperties = {
  color: "#282833",
  borderBottom: "2px solid #282833",
};

const customActiveTitleStyle: React.CSSProperties = {
  color: "#282833",
};

const customActiveStyle: React.CSSProperties = {
  width: "1.04vw",
  height: "1.04vw",
  color: "#fff",
  background: "#282833",
};

interface ManageTeamToggleTabProps {
  activeTab: string | string[];
  setActiveTab: (tab: string) => void;
  invitedUsersCount: number;
}

const ManageTeamToggleTab: React.FC<ManageTeamToggleTabProps> = ({
  activeTab,
  setActiveTab,
  invitedUsersCount,
}) => {
  return (
    <ul className='flex items-center justify-start max-w-full w-full mt-[1.56vw] px-[1.56vw] space-x-[1.51vw] border-b-[0.05vw] border-[#E0E0E9] relative'>
      <li
        className='flex items-center justify-center border-b-[2px] border-transparent font-semibold text-[0.94vw] leading-[1.24vw] text-grayish-blue !cursor-pointer hover:text-very-dark-grayish-blue'
        style={activeTab === "myteam" ? customActiveUnderlineStyle : {}}
        onClick={() => setActiveTab("myteam")}
      >
        <a
          className={`text-[0.94vw] pb-[1.09vw] ${
            activeTab === "myteam" ? "font-semibold" : "font-medium"
          }`}
        >
          My Team
        </a>
      </li>
      <li
        className='group flex items-center justify-center border-b-[2px] border-transparent font-semibold text-[0.94vw] leading-[1.24vw] !cursor-pointer'
        style={
          activeTab === "sentinvitations" ? customActiveUnderlineStyle : {}
        }
        onClick={() => setActiveTab("sentinvitations")}
      >
        <div
          className='flex items-baseline justify-center text-grayish-blue space-x-[0.52vw] group-hover:text-very-dark-grayish-blue'
          style={activeTab === "sentinvitations" ? customActiveTitleStyle : {}}
        >
          {invitedUsersCount > 0 && (
            <span
              className='flex items-center justify-center w-[1.04vw] p-[0.208vw] h-[1.04vw] bg-grayish-blue rounded-full text-[0.83vw] text-center text-[#ffffff] group-hover:bg-very-dark-grayish-blue'
              style={activeTab === "sentinvitations" ? customActiveStyle : {}}
            >
              {invitedUsersCount}
            </span>
          )}
          <span
            className='text-[0.94vw] pb-[1.09vw] font-medium'
          >
            Sent Invitations
          </span>
        </div>
      </li>
    </ul>
  );
};

export default ManageTeamToggleTab;
