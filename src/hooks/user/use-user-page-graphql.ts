import {
  ADD_PROJECT_MEMBER,
  DELETE_MULTIPLE_USERS,
  DELETE_USER,
  EDIT_USER,
  INVITE_USER,
  UPDATE_MULTIPLE_USERS,
} from "@/graphql/mutations/user";
import { GET_PROJECTS_DATA, GET_USERS } from "@/graphql/queries/user";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { useCallback, useEffect, useMemo } from "react";
import useUserPage from "./use-user-page";
import userAtom from "@/atoms/user-atom";
import { useRecoilState } from "recoil";

const useUserPageGraphql = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const { updateUserPage, userPageState, unSelectUsers, getUserInfo } =
    useUserPage();

  const [getUsers, { loading, error, data }] = useLazyQuery(GET_USERS, {
    context: { clientName: "tracker" },
    variables: {
      input: {
        status: "ACTIVE",
      },
    },

    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log(data, "data");
    },
  });

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formatDate = (dateString: string) => {
    let date = new Date(dateString);
    let formattedDate =
      months[date.getMonth()] +
      ", " +
      date.getDate() +
      " " +
      date.getFullYear();
    return formattedDate;
  };

  useEffect(() => {
    const response = data?.getUsers?.data;
    if (response) {
      let userData = response.map((data: any) => {
        let location = data.location || "";

        // Ensure projects are always properly mapped
        const projects = data.projects || [];
        const mappedProjects = projects.map((project: any) => ({
          _id: project._id,
          projectName: project.projectName,
        }));

        let acceptedInviteValue = data.acceptedInvite;
        if (acceptedInviteValue === undefined || acceptedInviteValue === null) {
          acceptedInviteValue = data.status !== "INVITED";
        }

        const userObj = {
          image: data.profileImg,
          title: data.title,
          name: data.name,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role:
            data.role === "ORGANIZATION_MANAGER"
              ? "Organisation manager"
              : data.role === "PROJECT_MANAGER"
                ? "Project Manager"
                : data.role === "USER"
                  ? "User"
                  : "Viewer",
          numOfProjects: mappedProjects.length,
          projectList: mappedProjects,
          projects: mappedProjects,
          acceptedInvite: acceptedInviteValue,
          status:
            data.status === "ACTIVE"
              ? "Active"
              : data.status === "INVITED"
                ? "Invited"
                : data.status === "SUSPENDED"
                  ? "Suspended"
                  : "Deleted",
          location: location,
          date: formatDate(data.createdAt),
          checked: false,
          id: data._id,
          isBilledSeat: data.isBilledSeat,
        };

        return userObj;
      });
      updateUserPage({ users: userData });
    }
  }, [data]);

  const runGetUsersQuery = useCallback(
    (input?: any) => {
      if (input?.status === "INACTIVE") {
        const { status, ...restInput } = input;
        getUsers({
          variables: {
            input: {
              ...restInput,
            },
          },
        });
      } else {
        getUsers({
          variables: {
            input: {
              ...input,
            },
          },
        });
      }
    },
    [getUsers],
  );

  const [
    getProjects,
    { loading: projectLoading, error: projectError, data: projectData },
  ] = useLazyQuery(GET_PROJECTS_DATA, {
    context: { clientName: "tracker" },
    fetchPolicy: "network-only",
    onCompleted: () => {
      console.log("Projects fetched successfully from user page graphql");
    },
  });
  useEffect(() => {
    const response = projectData?.getProjects?.data;
    if (response) {
      let userData = response.map((project: any) => ({
        id: project._id,
        name: project.projectName,
        image: project.projectImage,
        status: project.status,
      }));
      updateUserPage({ projects: userData });
    }
  }, [projectData]);

  const runGetProjectsQuery = useCallback(() => {
    getProjects({
      variables: {
        input: {
          organization: user?.userData?.attachedOrganization?._id,
        },
      },
    });
  }, [getProjects, user]);

  const [addMember, { loading: addMemberLoading, error: addMemberError }] =
    useMutation(ADD_PROJECT_MEMBER, { context: { clientName: "tracker" } });

  const addProjectMember = async (
    selectedProjects: (string | number)[],
    selectedUser: string,
  ) => {
    try {
      const { data } = await addMember({
        variables: {
          input: {
            newProjects: selectedProjects,
            userId: selectedUser,
            organization: user?.userData?.attachedOrganization?._id,
          },
        },
        refetchQueries: [GET_PROJECTS_DATA, GET_USERS],
      });
      return data;
    } catch (error) {
      console.log(error, "add member error");
    }
  };

  const [editUserMutation, { loading: editUserLoading, error: editUserError }] =
    useMutation(EDIT_USER, { context: { clientName: "tracker" } });

  const editUser = async (
    selectedProjects: (string | number)[],
    selectedUser: string,
    status: string,
  ) => {
    try {
      if (!selectedUser || selectedUser.trim() === "") {
        console.error("Invalid user ID provided:", selectedUser);
        return { editUser: false, error: "Invalid user ID" };
      }

      const inputPayload = {
        projects: selectedProjects || [],
        status: status,
        userId: selectedUser.trim(),
        attachedOrganization: user?.userData?.attachedOrganization?._id,
      };

      console.log("Sending edit user mutation with payload:", inputPayload);

      const { data } = await editUserMutation({
        variables: {
          input: inputPayload,
        },
        refetchQueries: [
          {
            query: GET_USERS,
            variables: {
              input: {
                status: status === "ACTIVE" ? "ACTIVE" : null,
              },
            },
          },
        ],
        awaitRefetchQueries: true,
      });

      console.log("Edit user mutation response:", data);
      return data;
    } catch (error) {
      console.error("Error in editUser mutation:", error);
      return { editUser: false, error };
    }
  };

  const [
    suspendMultipleUsersMutation,
    { loading: suspendUsersLoading, error: suspendUsersError },
  ] = useMutation(UPDATE_MULTIPLE_USERS, {
    context: { clientName: "tracker" },
  });

  const suspendMultipleUsers = async (status: string) => {
    try {
      let selectedUsers = userPageState.selectedUsers;

      if (
        !selectedUsers ||
        !Array.isArray(selectedUsers) ||
        selectedUsers.length === 0
      ) {
        console.error("No users selected for suspend/restore operation");
        return { updateUserStatus: false, error: "No users selected" };
      }

      const validatedUserIds = selectedUsers
        .filter((id) => id && typeof id === "string" && id.trim() !== "")
        .map((id) => id.trim());

      if (validatedUserIds.length === 0) {
        console.error("No valid user IDs found in selection");
        return { updateUserStatus: false, error: "No valid user IDs" };
      }

      const organizationId = user?.userData?.attachedOrganization?._id;

      if (!organizationId) {
        console.error("No organization ID found in user data");
        return {
          updateUserStatus: false,
          error: "You are not affiliated with this organization",
        };
      }

      console.log("Suspending/restoring users with status:", status);
      console.log("Selected users:", validatedUserIds);
      console.log("Organization ID:", organizationId);

      const { data } = await suspendMultipleUsersMutation({
        variables: {
          args: {
            status: status,
            userIds: validatedUserIds,
            organization: organizationId,
          },
        },
        refetchQueries: [
          {
            query: GET_USERS,
            variables: {
              input: {
                status: status === "ACTIVE" ? "ACTIVE" : null,
              },
            },
          },
        ],
        awaitRefetchQueries: true,
      });

      console.log("Suspend multiple users response:", data);
      unSelectUsers();
      return data;
    } catch (error) {
      console.error("Error in suspendMultipleUsers:", error);
      return { updateUserStatus: false, error };
    }
  };

  const [
    deleteUserMutation,
    { loading: deleteserLoading, error: deleteUserError },
  ] = useMutation(DELETE_USER, { context: { clientName: "tracker" } });
  const deleteUser = async (selectedUser: string) => {
    try {
      const { data } = await deleteUserMutation({
        variables: {
          userId: selectedUser,
        },
      });
      unSelectUsers();
      return data;
    } catch (error) {
      console.log(error, "add member error");
    }
  };

  const [
    deleteMultipleUsersMutation,
    { loading: deleteMultiUsersLoading, error: deleteMultiUserError },
  ] = useMutation(DELETE_MULTIPLE_USERS, {
    context: { clientName: "tracker" },
  });

  const deleteMultipleUsers = async () => {
    let selectedUsers = userPageState.selectedUsers;

    if (
      !selectedUsers ||
      !Array.isArray(selectedUsers) ||
      selectedUsers.length === 0
    ) {
      console.error("No users selected for deletion");
      return { deleteManyUsers: false, error: "No users selected" };
    }

    const validatedUserIds = selectedUsers
      .filter((id) => id && typeof id === "string" && id.trim() !== "")
      .map((id) => id.trim());

    if (validatedUserIds.length === 0) {
      console.error("No valid user IDs found in selection");
      return { deleteManyUsers: false, error: "No valid user IDs" };
    }

    const organizationId = user?.userData?.attachedOrganization?._id;

    if (!organizationId) {
      console.error("No organization ID found in user data");
      return {
        deleteManyUsers: false,
        error: "You are not affiliated with this organization",
      };
    }

    console.log("Deleting users:", validatedUserIds);
    console.log("Organization ID:", organizationId);

    try {
      const { data } = await deleteMultipleUsersMutation({
        variables: {
          args: {
            userIds: validatedUserIds,
            organization: organizationId,
          },
        },
        refetchQueries: [GET_USERS],
        awaitRefetchQueries: true,
      });

      console.log("Delete multiple users response:", data);
      unSelectUsers();
      return data;
    } catch (error) {
      console.error("Error in deleteMultipleUsers:", error);
      return { deleteManyUsers: false, error };
    }
  };

  const [
    reInviteUserMutation,
    { loading: reInviteUserLoading, error: reInviteUserError },
  ] = useMutation(INVITE_USER, { context: { clientName: "tracker" } });

  const reInviteUser = async (selectedUser: string, userData?: any) => {
    let userInfo = userData || getUserInfo(selectedUser);

    if (!userInfo) {
      return { inviteUsers: false, error: "User not found" };
    }

    const title = userInfo?.title || "Mr";
    const email = userInfo?.email;
    const firstName = userInfo?.firstName || "";
    const lastName = userInfo?.lastName || "";
    const profileImg = userInfo?.image || "";

    if (!email) {
      return { inviteUsers: false, error: "Email is required" };
    }

    try {
      const { data, errors } = await reInviteUserMutation({
        variables: {
          input: {
            title: title,
            role:
              userInfo?.role === "Organisation manager"
                ? "ORGANIZATION_MANAGER"
                : userInfo?.role === "Project Manager"
                  ? "PROJECT_MANAGER"
                  : userInfo?.role === "User"
                    ? "USER"
                    : "VIEW",
            lastName: lastName,
            firstName: firstName,
            email: email,
            profileImg: profileImg,
            location: userInfo?.location,
            organization:
              user?.userData?.attachedOrganization?._id ||
              "65169b7ef0410efa3245d795",
          },
        },
      });

      if (errors && errors.length > 0) {
        return { inviteUsers: false, error: errors[0].message };
      }

      return data;
    } catch (error) {
      console.log(error, "reinvite user error");
      return { inviteUsers: false, error };
    }
  };
  return useMemo(
    () => ({
      loading: loading,
      runGetUsersQuery,
      runGetProjectsQuery,
      addProjectMember,
      editUser,
      suspendMultipleUsers,
      deleteUser,
      deleteMultipleUsers,
      reInviteUser,
    }),
    [
      data,
      projectData,
      loading,
      runGetUsersQuery,
      runGetProjectsQuery,
      addProjectMember,
      editUser,
      suspendMultipleUsers,
      deleteUser,
      deleteMultipleUsers,
      reInviteUser,
    ],
  );
};

export default useUserPageGraphql;
