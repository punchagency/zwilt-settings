import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import {
  GET_INVITED_USERS,
  GET_ORGANIZATION_MEMBERS,
} from "@/graphql/queries/manageTeam";
import PlusIcon from "@/assests/icons/plus.svg";
import { OrganizationMember } from "./manageteam-role/user.interface";
import InvitationModal from "./modals/InvitationModal";
import AddMemberToOrganizationModal from "./modals/AddMemberToOrganizationModal";
import ManageTeamToggleTab from "./ManageTeamToggleTab";
import ManageOrganization from "./ManageOrganization";
import SentInvitation from "./SentInvitation";
import InvitationIcon from "./InviteIcon";
import useUser from "utils/recoil_store/hooks/use-user-state";
import SearchBar from "./SearchBar";
import { ToastContainer } from "react-toastify";
import { useOrganizationMembers } from "utils/recoil_store/hooks/use-organization-members";

interface User {
  __typename: string;
  _id: string;
  user: {
    __typename: string;
    email: string;
    name?: string;
    profile_img: string;
    createdAt: null;
  };
  role: string;
  clientAccountType: string;
  profileStatus: string;
}

const ManageTeam: React.FC = () => {
  const router = useRouter();
  const { tab } = router.query;
  const { userState } = useUser();
  const [input, setInput] = useState("");
  const [filteredInvitedUsers, setFilteredInvitedUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState(tab || "myteam");
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [invitedUsersCount, setInvitedUsersCount] = useState(0);

  const { members, setMembers } = useOrganizationMembers();

  const { data, loading, error, refetch } = useQuery(GET_ORGANIZATION_MEMBERS, {
    onCompleted: (data) => {
      setMembers(data.getOrganizationMembers.data);
    },
  });

  const { data: invitedUsersData } = useQuery(GET_INVITED_USERS);

  // Keep the memoized filters
  const filteredAdmins = useMemo(
    () =>
      members.filter(
        (member) =>
          member?.clientAccountType === "ADMIN" &&
          member?.user?.name?.toLowerCase().includes(input.toLowerCase())
      ),
    [members, input]
  );

  const filteredMembers = useMemo(
    () =>
      members.filter(
        (member) =>
          member?.clientAccountType !== "ADMIN" &&
          member?.user?.name?.toLowerCase().includes(input.toLowerCase())
      ),
    [members, input]
  );

  // Update count and set initial filtered invited users
  useEffect(() => {
    if (invitedUsersData && invitedUsersData.getInvitedUsers) {
      const invitedUsers = invitedUsersData.getInvitedUsers.data;
      const count = invitedUsers.length;
      setInvitedUsersCount(count);
      setFilteredInvitedUsers(invitedUsers);
    } else {
      setInvitedUsersCount(0);
      setFilteredInvitedUsers([]);
    }
  }, [invitedUsersData]);

  // Filter organization members
  // useEffect(() => {
  //   if (data) {
  //     const searchQuery = input.toLowerCase();
  //     const admins = data.getOrganizationMembers.data.filter(
  //       (user: OrganizationMember) =>
  //         user.clientAccountType === "ADMIN" &&
  //         user.user.name.toLowerCase().includes(searchQuery)
  //     );
  //     const members = data.getOrganizationMembers.data.filter(
  //       (user: OrganizationMember) =>
  //         user.clientAccountType === "MEMBER" &&
  //         user?.user?.name.toLowerCase().includes(searchQuery)
  //     );
  //     setFilteredAdmins(admins);
  //     setFilteredMembers(members);
  //   }
  // }, [input, data]);

  // Filter invited users
  useEffect(() => {
    if (invitedUsersData) {
      const searchQuery = input.toLowerCase();
      const filteredUsers = invitedUsersData.getInvitedUsers.data.filter(
        (invite: OrganizationMember) =>
          invite.user?.name?.toLowerCase().includes(searchQuery) ||
          invite.user.email.toLowerCase().includes(searchQuery) ||
          invite.role.toLowerCase().includes(searchQuery) ||
          invite.clientAccountType.toLowerCase().includes(searchQuery)
      );
      setFilteredInvitedUsers(filteredUsers);
    }
  }, [input, invitedUsersData]);

  useEffect(() => {
    router.push(`/manageteam?tab=${activeTab}`);
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    setInput(""); // Reset search input when changing tabs
    setActiveTab(tab);
  };

  const handleInviteTeamModal = () => {
    setCurrentModal("inviteTeam");
  };

  const showAddTeamModal = () => {
    setCurrentModal("addTeam");
  };

  const handleCloseModal = () => {
    setCurrentModal(null);
  };

  return (
    <div className="max-w-full w-full relative ">
      <ToastContainer />
      <nav className="flex items-center w-full py-[1.04vw] pl-[1.56vw] pr-[1.30vw] border-b-[0.05vw] border-[#E0E0E9]">
        <div className="flex items-center w-full justify-between">
          <div className="flex flex-col items-start p-0 w-[17.60vw]">
            <h2 className="text-[1.25vw] font-switzer font-semibold text-left text-very-dark-grayish-blue leading-[1.63vw]">
              Manage Team
            </h2>
            <p className="text-[0.83vw] font-normal leading-[1.08vw] text-left text-grayish-blue mt-[0.52vw]">
              Assign roles and manage your team members.
            </p>
          </div>

          <div className="flex items-center justify-end">
            <SearchBar input={input} setInput={setInput} />

            {/* Rest of the navigation buttons remain the same */}
            <button
              onClick={handleInviteTeamModal}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex justify-center items-center p-[0.51vw_1.02vw] h-[2.55vw] gap-[0.51vw] w-[6.14vw] bg-[#FFFFFF] border-[0.05vw] border-[#E0E0E9] rounded-[0.78vw] ml-[0.89vw] cursor-pointer group hover:bg-[#f4f4fa] hover:border-[#b8b8cd]"
            >
              <InvitationIcon isHovered={isHovered} />

              <span className="capitalize text-[0.94vw] font-normal leading-[1.25vw] text-left text-[#696970] group-hover:text-[#282833B2]">
                invite
              </span>
            </button>

            {userState.currentUser.clientAccountType === "ADMIN" && (
              <button
                onClick={showAddTeamModal}
                className="flex justify-center items-center p-[0.52vw_1.25vw] gap-[0.52vw] w-[11.77vw] h-[2.55vw] bg-[#50589F] rounded-[0.78vw] ml-[0.82vw] cursor-pointer hover:bg-[#42498B]"
              >
                <Image
                  src={PlusIcon}
                  className="w-[0.63vw] h-[0.63vw]"
                  alt="add team member"
                />
                <span className="flex whitespace-nowrap capitalize text-[0.94vw] font-normal leading-[1.24vw] text-left text-[#ffffff]">
                  Add Team Member
                </span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <ManageTeamToggleTab
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        invitedUsersCount={invitedUsersCount}
      />

      <div
        className={`flex flex-col items-start w-full text-very-dark-grayish-blue overflow-hidden 
          scrollbar-thin p-0`}
      >
        {activeTab === "myteam" ? (
          <ManageOrganization
            filteredAdmins={filteredAdmins}
            filteredMembers={filteredMembers}
          />
        ) : (
          <SentInvitation
            filteredInvitedUsers={filteredInvitedUsers}
            setFilteredInvitedUsers={setFilteredInvitedUsers}
          />
        )}
      </div>

      {currentModal === "inviteTeam" && (
        <InvitationModal
          setCurrentModal={setCurrentModal}
          handleCloseModal={handleCloseModal}
          filteredInvitedUsers={filteredInvitedUsers}
        />
      )}

      {currentModal === "addTeam" && (
        <AddMemberToOrganizationModal
          setCurrentModal={setCurrentModal}
          handleCloseModal={handleCloseModal}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default ManageTeam;
