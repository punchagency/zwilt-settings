import React, { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteMultipleUsers from "../modals/DeleteMultipleUsers";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import DeleteTeamModal from "../modals/DeleteSingleUserModal";
import UpdateOrganizationMemeberModal from "../modals/UpdateOrganizationMemeberModal";
import { OrganizationMember, User } from "./user.interface";
import useUser from "utils/recoil_store/hooks/use-user-state";

interface Props {
  admins: Array<OrganizationMember>;
  refetch: () => void;
  currentModal: string | null;
  setCurrentModal: React.Dispatch<React.SetStateAction<string | null>>;
  deleteMembersFromOrganization: any;
  isAdmin: boolean;
  userToDelete: User | null;
  setUserToDelete: React.Dispatch<React.SetStateAction<User | null>>;
  handleDeleteMember: () => void;
}
interface UserWithCheck extends User {
  isChecked: boolean;
  profile_img: string;
  lastActive: string;
  role: string;
}

const ManageAdmin: React.FC<Props> = ({
  admins,
  refetch,
  currentModal,
  setCurrentModal,
  deleteMembersFromOrganization,
  isAdmin,
  userToDelete,
  setUserToDelete,
  handleDeleteMember,
}) => {
  const { userState } = useUser();
  const [selectedAdminCount, setSelectedAdminCount] = useState(0);
  // const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<{
    user: User;
    role: string;
  } | null>(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      selectAll: false,
      users: admins?.map((member: OrganizationMember) => ({
        ...member.user,
        role: member.role,
        profile_img: member.user.profile_img || "",
        lastActive: member.user.lastActive || "",
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

    setSelectedAdminCount(selectedUsers.length);
    setCurrentModal("deleteMultipleAdmins");
  };

  const deleteSingleTeamMember = (user: OrganizationMember["user"]) => {
    setCurrentModal("deleteSingleAdmin");
    setUserToDelete(user);
  };

  const deleteMultipleAdminsFromOrganization = async () => {
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
        users: prevValues.users.filter(
          (user: UserWithCheck) => !user.isChecked
        ),
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

  const updateOrganizationAdminInfo = (user: User, role: string) => {
    setUserToEdit({ user, role });
    setCurrentModal("updateAdmin");
  };

  return (
    <div className="flex items-start justify-between py-[1.56vw] pr-[0.99vw] pl-[1.7vw] w-full">
      <div className="flex flex-col items-start p-0 w-[11.77vw] flex-nowrap">
        <h2 className="text-[1.04vw] font-semibold text-left text-very-dark-grayish-blue leading-[1.35vw]">
          Admin User
        </h2>
        <p className="text-[0.83vw] font-normal leading-[1.08vw] text-left text-grayish-blue mt-[0.26vw]">
          Admin can add or remove user
        </p>
      </div>

      <form className="flex flex-col items-end max-w-[47.92vw] w-full">
        <table className="w-full">
          <TableHeader
            columns={["Name", "Team Role", "Date Added"]}
            selectAllId="selectAllAdminUser"
            selectAllChecked={formik.values.selectAll}
            onSelectAllChange={handleSelectAllChange}
            selectedUserCount={
              formik.values.users?.filter(
                (user: UserWithCheck) => user.isChecked
              ).length
            }
            showDeleteModal={showDeleteModal}
          />

          <tbody className="w-full">
            {formik.values.users?.length ? (
              formik.values.users?.map((user: UserWithCheck, index: number) => (
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
                  onUpdateUser={updateOrganizationAdminInfo}
                  isAdmin={userState?.currentUser?.clientAccountType === "ADMIN"}
                />
              ))
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
      </form>

      {currentModal === "deleteSingleAdmin" && (
        <DeleteTeamModal
          userToDelete={userToDelete}
          handleDeleteMember={handleDeleteMember}
          handleCloseModal={handleCloseModal}
        />
      )}

      {currentModal === "deleteMultipleAdmins" && (
        <DeleteMultipleUsers
          handleCloseModal={handleCloseModal}
          selectedUserCount={selectedAdminCount}
          onDeleteTeamMember={deleteMultipleAdminsFromOrganization}
        />
      )}

      {currentModal === "updateAdmin" && userToEdit && (
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

export default ManageAdmin;
