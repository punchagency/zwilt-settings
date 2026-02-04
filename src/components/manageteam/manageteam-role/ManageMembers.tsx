import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import UpdateOrganizationMemeberModal from "../modals/UpdateOrganizationMemeberModal";
import DeleteMultipleUsers from "../modals/DeleteMultipleUsers";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { OrganizationMember, User } from "./user.interface";
import DeleteTeamModal from "../modals/DeleteSingleUserModal";
import useUser from "utils/recoil_store/hooks/use-user-state";

interface UserWithCheck extends User {
  isChecked: boolean;
  role: string;
  profile_img?: string;
  lastActive?: string;
}

interface Props {
  members: Array<OrganizationMember>;
  currentModal: string | null;
  setCurrentModal: React.Dispatch<React.SetStateAction<string | null>>;
  refetch: () => void;
  deleteMembersFromOrganization: any;
  isAdmin: boolean;
  userToDelete: OrganizationMember["user"]| null;
  setUserToDelete: React.Dispatch<React.SetStateAction<OrganizationMember["user"] | null>>;
  handleDeleteMember: () => void;
}

const ManageMembers: React.FC<Props> = ({
  members,
  currentModal,
  setCurrentModal,
  refetch,
  deleteMembersFromOrganization,
  isAdmin,
  userToDelete,
  setUserToDelete,
  handleDeleteMember,
}) => {
  const { userState } = useUser();
  const [selectedMemberCount, setSelectedMemberCount] = useState(0);
  // const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<{
    user: User;
    role: string;
  } | null>(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      selectAll: false,
      users: members?.map((member: OrganizationMember) => ({
        ...member.user,
        role: member.role,
        isChecked: false,
      })) as UserWithCheck[],
    },
    validationSchema: Yup.object({
      users: Yup.array().of(
        Yup.object({
          isChecked: Yup.boolean(),
        })
      ),
    }),
    onSubmit: (values) => {
      console.log("Form values", values);
    },
  });

  useEffect(() => {
    console.log("Members prop:", members);
  }, [members]);

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    formik.setValues({
      ...formik.values,
      selectAll: checked,
      users: formik.values.users.map((user: UserWithCheck) => ({
        ...user,
        role: user.role,
        isChecked: checked,
      })),
    });
  };

  // Function to handle individual checkbox change
  const handleSingleCheckboxChange = (userId: string, checked: boolean) => {
    const updatedUsers = [...formik.values.users].map((user) => {
      if (user._id === userId) {
        return {
          ...user,
          isChecked: checked,
        };
      }

      return user;
    });

    formik.setValues({
      ...formik.values,
      users: updatedUsers,
    });
  };

  const handleCloseModal = () => {
    setCurrentModal(null);
    setUserToEdit(null);
  };

  const showDeleteModal = () => {
    const selectedUsers = formik.values.users.filter(
      (user: UserWithCheck) => user.isChecked
    );

    setSelectedMemberCount(selectedUsers.length);
    setCurrentModal("deleteMultipleMembers");
  };

  const deleteSingleTeamMember = (user: OrganizationMember["user"]) => {
    setCurrentModal("deleteSingleUser");
    setUserToDelete(user);
  };

  const deleteMultipleMembersFromOrganization = async () => {
    const selectedUsers = formik.values.users.filter(
      (user: UserWithCheck) => user.isChecked
    );

    try {
      // Perform the deletion for each selected user
      await Promise.all(
        selectedUsers.map((user: UserWithCheck) => {
          return deleteMembersFromOrganization({
            variables: { memberId: user._id },
          });
        })
      );

      // Refetch the data to get the updated list of users
      await refetch();

      // Update the local state to remove the deleted users
      formik.setValues((prevValues) => ({
        ...prevValues,
        users: prevValues.users.filter((user: UserWithCheck) => !user.isChecked),
        selectAll: false,
      }));

      setCurrentModal(null); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  const capitalizeEveryWord = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const updateOrganizationMemberInfo = (user: User, role: string) => {
    setUserToEdit({ user, role });
    setCurrentModal("updateTeamMember");
  };


  return (
    <div className="flex items-start justify-between py-[1.56vw] pr-[0.99vw] pl-[1.7vw] w-full">
      <div className="flex flex-col items-start p-0 w-[12.81vw] flex-nowrap">
        <h2 className="text-[1.04vw] font-semibold text-left text-[#282833] leading-[1.35vw]">
          Account User
        </h2>
        <p className="text-[0.83vw] font-normal leading-[1.08vw] text-left text-grayish-blue mt-[0.26vw]">
          These are the account user in our zwilt team.
        </p>
      </div>

      <div className="flex flex-col items-end max-w-[47.92vw] w-full">
        <table className="w-full h-full">
          <TableHeader
            columns={["Name", "Team Role", "Date Added"]}
            selectAllId="selectAllAccountUser"
            selectAllChecked={formik.values.selectAll}
            onSelectAllChange={handleSelectAllChange}
            selectedUserCount={
              formik.values.users?.filter((user: UserWithCheck) => user.isChecked).length
            }
            showDeleteModal={showDeleteModal}
          />

          <tbody className="w-full">
            {formik.values.users?.length ? (
              formik.values.users?.map(
                (user: UserWithCheck, index: number) => (
                  <TableBody
                    key={index}
                    user={user}
                    role={user.role}
                    isChecked={user.isChecked}
                    onChange={(checked: boolean) =>
                      handleSingleCheckboxChange(user._id, checked)
                    }
                    isFirstItem={index === 0}
                    deleteSingleTeamMember={deleteSingleTeamMember}
                    onUpdateUser={updateOrganizationMemberInfo}
                    isAdmin={userState?.currentUser?.clientAccountType === "ADMIN"}
                  />
                )
              )
            ) : (
              <tr className="w-full text-center">
                <td
                  colSpan={3}
                  className="pt-[1.04vw] text-center font-medium text-very-dark-grayish-blue"
                >
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {currentModal === "deleteSingleUser" && (
        <DeleteTeamModal
          userToDelete={userToDelete}
          handleDeleteMember={handleDeleteMember}
          handleCloseModal={handleCloseModal}
        />
      )}

      {currentModal === "deleteMultipleMembers" && (
        <DeleteMultipleUsers
          handleCloseModal={handleCloseModal}
          selectedUserCount={selectedMemberCount}
          onDeleteTeamMember={deleteMultipleMembersFromOrganization}
        />
      )}

      {currentModal === "updateTeamMember" && userToEdit && (
        <UpdateOrganizationMemeberModal
          user={userToEdit.user}
          role={userToEdit.role}
          setUserToEdit={setUserToEdit}
          setCurrentModal={setCurrentModal}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ManageMembers;
