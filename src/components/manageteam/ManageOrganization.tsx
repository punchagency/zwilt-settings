import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { notifyErrorFxn, notifySuccessFxn } from "utils/toast-fxn";
import { GET_ORGANIZATION_MEMBERS } from "@/graphql/queries/manageTeam";
import { DELETE_MEMBER_FROM_ORGANIZATION } from "@/graphql/mutations/manageTeam";
import { OrganizationMember, User } from "./manageteam-role/user.interface";
import ManageAdmin from "./manageteam-role/ManageAdmin";
import ManageMembers from "./manageteam-role/ManageMembers";
import Loader from "./Loader";
import Error from "./Error";
import useUser from "utils/recoil_store/hooks/use-user-state";
import { useOrganizationMembers } from "utils/recoil_store/hooks/use-organization-members";
import { useAdminStatus } from "utils/recoil_store/hooks/use-admin-status";

interface Props {
  filteredAdmins: any;
  filteredMembers: any;
}
const ManageOrganization: React.FC<Props> = ({
  filteredAdmins,
  filteredMembers,
}) => {
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<OrganizationMember["user"] | null>(null);

  const { setMembers } = useOrganizationMembers();
  const { data, loading, error, refetch } = useQuery(GET_ORGANIZATION_MEMBERS);

  const [deleteMembersFromOrganization] = useMutation(
    DELETE_MEMBER_FROM_ORGANIZATION,
    {
      onCompleted: () => {
     
        setUserToDelete(null);
      },
      onError: (error) => {
        
        setCurrentModal(null);
        notifyErrorFxn("Failed to delete the profile. Please try again.");
      }
    }
  );
  
  const handleDeleteMember = () => {
    if (!userToDelete) return;
    // Optimistically update the UI immediately
    setMembers(prevMembers => prevMembers.filter(member => member?.user?._id !== userToDelete?._id));
    notifySuccessFxn("Profile deleted successfully!");
    // Close the modal immediately for better UX
    setCurrentModal(null);
    // Perform the actual deletion
    deleteMembersFromOrganization({
      variables: { memberId: userToDelete._id },
    });
  };
  const { checkAdminStatus, isAdmin } = useAdminStatus();

  useEffect(() => {
    checkAdminStatus(filteredAdmins);
  }, [filteredAdmins]);

  if (loading) return <Loader />;
  if (error) return <Error />;
  


  return (
    <>
      <ManageAdmin
        admins={filteredAdmins}
        currentModal={currentModal}
        setCurrentModal={setCurrentModal}
        refetch={refetch}
        deleteMembersFromOrganization={deleteMembersFromOrganization}
        handleDeleteMember={handleDeleteMember}
        isAdmin={isAdmin}
        userToDelete={userToDelete}
        setUserToDelete={setUserToDelete}
      />
      <div className="w-full border-b border-[#e0e0e9]"></div>
      <ManageMembers
        members={filteredMembers}
        currentModal={currentModal}
        setCurrentModal={setCurrentModal}
        refetch={refetch}
        handleDeleteMember={handleDeleteMember}
        deleteMembersFromOrganization={deleteMembersFromOrganization}
        isAdmin={isAdmin}
        userToDelete={userToDelete}
        setUserToDelete={setUserToDelete}
      />
    </>
  );
};

export default ManageOrganization;
