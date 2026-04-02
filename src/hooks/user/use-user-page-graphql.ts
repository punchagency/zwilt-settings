import {
  ADD_PROJECT_MEMBER,
  DELETE_MULTIPLE_USERS,
  DELETE_USER,
  EDIT_USER,
  INVITE_USER as TRACKER_INVITE_USER,
  UPDATE_MULTIPLE_USERS,
} from "@/graphql/mutations/user";
import { GET_PROJECTS_DATA, GET_USERS } from "@/graphql/queries/user";
import {
  GET_ORGANIZATION_MEMBERS,
  GET_INVITED_USERS,
} from "@/graphql/queries/manageTeam";
import {
  DELETE_MEMBER_FROM_ORGANIZATION,
  SUSPEND_SEAT,
  REACTIVATE_SEAT,
  INVITE_USER,
} from "@/graphql/mutations/manageTeam";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { useCallback, useEffect, useMemo } from "react";
import useUserPage from "./use-user-page";
import userAtom from "@/atoms/user-atom";
import { useRecoilState } from "recoil";

const BILLABLE_ROLES = ["ORGANIZATION_OWNER", "ORGANIZATION_MANAGER"];
const OTHER_APPS = [
  "sales",
  "recruit",
  "market",
  "recruitment",
  "sell",
  "store",
];

const useUserPageGraphql = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const { updateUserPage, userPageState, unSelectUsers, getUserInfo } =
    useUserPage();

  const [
    getMembers,
    { loading: membersLoading, error: membersError, data: membersData },
  ] = useLazyQuery(GET_ORGANIZATION_MEMBERS, {
    fetchPolicy: "network-only",
  });

  const [
    getInvited,
    { loading: invitedLoading, error: invitedError, data: invitedData },
  ] = useLazyQuery(GET_INVITED_USERS, {
    fetchPolicy: "network-only",
  });

  const formatDate = useCallback((dateString: string) => {
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
    let date = new Date(dateString);
    let formattedDate =
      months[date.getMonth()] +
      ", " +
      date.getDate() +
      " " +
      date.getFullYear();
    return formattedDate;
  }, []);

  useEffect(() => {
    const activeData = membersData?.getOrganizationMembers?.data || [];
    const invitedUsers = invitedData?.getInvitedUsers?.data || [];

    if (membersData || invitedData) {
      let combinedData = [...activeData, ...invitedUsers];

      let userDataMap = new Map<string, any>();

      combinedData.forEach((data: any) => {
        const user = data.user || {};
        const email = (user.email || data.email || "").toLowerCase();

        if (!email) return;

        const projects = data.projects || [];
        const mappedProjects = projects.map((project: any) => ({
          _id: project._id,
          projectName: project.projectTitle || project.projectName,
        }));

        let acceptedInviteValue = data.acceptedInvite;
        if (acceptedInviteValue === undefined || acceptedInviteValue === null) {
          acceptedInviteValue = data.seatStatus !== "INVITED";
        }

        const source = data.source || "recruit";
        const currentAppAccess =
          data.appAccess || (source === "tracker" ? ["tracker"] : ["recruit"]);

        if (userDataMap.has(email)) {
          const existing = userDataMap.get(email);
          // Merge logic
          existing.apps = Array.from(
            new Set([...existing.apps, ...currentAppAccess]),
          );
          existing.source = "merged";

          // Optionally update other fields if 'recruit' (core) data preferred
          if (source === "recruit") {
            existing.id = data._id;
            existing.isBilledSeat = data.isBilledSeat || existing.isBilledSeat;
            existing.role = formatRole(data.role);
            existing.rawRole = data.role;
          }
        } else {
          userDataMap.set(email, {
            image: user.profile_img || data.profileImg,
            title: data.title || "",
            name: user.name || data.name || email,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: email,
            role: formatRole(data.role),
            numOfProjects: mappedProjects.length,
            projectList: mappedProjects,
            projects: mappedProjects,
            acceptedInvite: acceptedInviteValue,
            status: formatStatus(data.seatStatus),
            location: data.location || "",
            date: formatDate(data.createdAt),
            designation: data.companyDetails?.designation || "",
            checked: false,
            id: data._id,
            isBilledSeat: data.isBilledSeat,
            apps: currentAppAccess,
            rawRole: data.role,
            source: source,
          });
        }
      });

      const userData = Array.from(userDataMap.values());

      function formatRole(role: string) {
        return role === "ORGANIZATION_OWNER"
          ? "Organisation owner"
          : role === "ORGANIZATION_MANAGER"
            ? "Organisation manager"
            : role === "PROJECT_MANAGER"
              ? "Project Manager"
              : role === "USER" || role === "Member"
                ? "User"
                : "Viewer";
      }

      function formatStatus(seatStatus: string) {
        return seatStatus === "SUSPENDED"
          ? "Suspended"
          : seatStatus === "INVITED"
            ? "Invited"
            : "Active";
      }

      // Filter based on active tab locally since getOrganizationMembers returns all
      const filteredData = userData.filter((user: any) => {
        if (userPageState.activeTab === 0) return user.status === "Active";
        if (userPageState.activeTab === 1) return user.status === "Suspended";
        if (userPageState.activeTab === 2) return user.status === "Invited";
        return true;
      });

      updateUserPage({ users: filteredData });
    }
  }, [
    membersData,
    invitedData,
    formatDate,
    updateUserPage,
    userPageState.activeTab,
  ]);

  const runGetUsersQuery = useCallback(
    (input?: any) => {
      if (userPageState.activeTab === 2) {
        getInvited();
      } else {
        getMembers();
      }
    },
    [getMembers, getInvited, userPageState.activeTab],
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
  }, [projectData, updateUserPage]);

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

  const addProjectMember = useCallback(
    async (selectedProjects: (string | number)[], selectedUser: string) => {
      try {
        const { data } = await addMember({
          variables: {
            input: {
              newProjects: selectedProjects,
              userId: selectedUser,
              organization: user?.userData?.attachedOrganization?._id,
            },
          },
          refetchQueries: [GET_PROJECTS_DATA, GET_ORGANIZATION_MEMBERS],
        });
        return data;
      } catch (error) {
        console.log(error, "add member error");
      }
    },
    [addMember, user],
  );

  const [editUserMutation, { loading: editUserLoading, error: editUserError }] =
    useMutation(EDIT_USER);

  const [suspendSeatMutation, { loading: suspendSeatLoading }] =
    useMutation(SUSPEND_SEAT);

  const [reactivateSeatMutation, { loading: reactivateSeatLoading }] =
    useMutation(REACTIVATE_SEAT);

  const editUser = useCallback(
    async (
      selectedProjects: (string | number)[],
      selectedUser: string,
      status: string,
    ) => {
      try {
        if (!selectedUser || selectedUser.trim() === "") {
          console.error("Invalid user ID provided:", selectedUser);
          return { editUser: false, error: "Invalid user ID" };
        }

        let result;
        if (status === "SUSPENDED") {
          result = await suspendSeatMutation({
            variables: { clientId: selectedUser },
          });
        } else if (status === "ACTIVE") {
          result = await reactivateSeatMutation({
            variables: { clientId: selectedUser },
          });
        }

        console.log("Edit user (seat status) response:", result);
        unSelectUsers();
        return result?.data;
      } catch (error) {
        console.error("Error in editUser (seat status):", error);
        return { editUser: false, error };
      }
    },
    [suspendSeatMutation, reactivateSeatMutation, unSelectUsers],
  );

  const [
    suspendMultipleUsersMutation,
    { loading: suspendUsersLoading, error: suspendUsersError },
  ] = useMutation(UPDATE_MULTIPLE_USERS);

  const suspendMultipleUsers = useCallback(
    async (status: string) => {
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
              query: GET_ORGANIZATION_MEMBERS,
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
    },
    [suspendMultipleUsersMutation, user, userPageState, unSelectUsers],
  );

  const [
    deleteUserMutation,
    { loading: deleteserLoading, error: deleteUserError },
  ] = useMutation(DELETE_MEMBER_FROM_ORGANIZATION);
  const deleteUser = useCallback(
    async (selectedUser: string) => {
      try {
        const { data } = await deleteUserMutation({
          variables: {
            memberId: selectedUser,
          },
        });
        unSelectUsers();
        return data;
      } catch (error) {
        console.log(error, "add member error");
      }
    },
    [deleteUserMutation, unSelectUsers],
  );

  const [
    deleteMultipleUsersMutation,
    { loading: deleteMultiUsersLoading, error: deleteMultiUserError },
  ] = useMutation(DELETE_MULTIPLE_USERS, {
    context: { clientName: "tracker" },
  });

  const deleteMultipleUsers = useCallback(async () => {
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
        refetchQueries: [GET_ORGANIZATION_MEMBERS],
        awaitRefetchQueries: true,
      });

      console.log("Delete multiple users response:", data);
      unSelectUsers();
      return data;
    } catch (error) {
      console.error("Error in deleteMultipleUsers:", error);
      return { deleteManyUsers: false, error };
    }
  }, [deleteMultipleUsersMutation, user, userPageState, unSelectUsers]);

  const [
    reInviteUserMutation,
    { loading: reInviteUserLoading, error: reInviteUserError },
  ] = useMutation(INVITE_USER);

  const reInviteUser = useCallback(
    async (selectedUser: string, userData?: any) => {
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
                userInfo?.role === "Organisation owner"
                  ? "ORGANIZATION_OWNER"
                  : userInfo?.role === "Organisation manager"
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
    },
    [reInviteUserMutation, getUserInfo, user],
  );
  return useMemo(
    () => ({
      loading: membersLoading || invitedLoading,
      error: membersError || invitedError,
      users: userPageState.users,
      projects: userPageState.projects,
      runGetUsersQuery,
      runGetProjectsQuery,
      addProjectMember,
      editUser,
      suspendMultipleUsers,
      deleteUser,
      deleteMultipleUsers,
      reInviteUser,
      getUserInfo,
    }),
    [
      membersLoading,
      invitedLoading,
      membersError,
      invitedError,
      userPageState.users,
      userPageState.projects,
      runGetUsersQuery,
      runGetProjectsQuery,
      addProjectMember,
      editUser,
      suspendMultipleUsers,
      deleteUser,
      deleteMultipleUsers,
      reInviteUser,
      getUserInfo,
    ],
  );
};

export default useUserPageGraphql;
