import userPageAtom, { defaultUserPageState } from "@/atoms/user-page-atom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";

const useUserPage = () => {
  const [recoilState, setRecoilState] = useRecoilState(userPageAtom);

  type IUserPageState = typeof recoilState;

  type IUserPageStateKey = keyof IUserPageState;

  type IPartialUserPageState = {
    [Property in IUserPageStateKey]?: IUserPageState[Property];
  };

  const [userPageState, setUserPageState] =
    useState<IUserPageState>(defaultUserPageState);

  const updateUserPage = useCallback(
    (update: IPartialUserPageState) => {
      setRecoilState((prevState) => ({
        ...prevState,
        ...update,
      }));
    },
    [setRecoilState]
  );

  useEffect(() => {
    setUserPageState(recoilState);
  }, [recoilState]);

  const getUsers = useCallback(() => {
    return userPageState.users;
  }, [userPageState]);

  const getUserInfo = useCallback(
    (id: string) => {
      let user = userPageState.users.find((u) => u.id === id);
      return user;
    },
    [userPageState]
  );

  const getProjects = useCallback(() => {
    return userPageState.projects;
  }, [userPageState]);

  const getProjectsName = useCallback(
    (projectList: any[]): (string | undefined)[] => {
      const names: (string | undefined)[] = projectList.map((project: any) => {
        // Try direct name from project object returned by GET_USERS
        const directName = (project as any)?.projectName;

        if (directName) return directName;

        // Fallback: look-up by id in the organization-wide projects list
        const projectId = typeof project === "string" ? project : (project as any)?._id;
        const foundProject = userPageState.projects.find((p: any) => p.id === projectId || p._id === projectId);

        return (foundProject as any)?.name || (foundProject as any)?.projectName;
      });

      // Filter out empty/undefined entries before returning
      return names.filter(Boolean);
    },
    [userPageState]
  );

  const getAssignedProjects = useCallback(
    (userId: string) => {
      let projects: any[] = [];
      userPageState.users.forEach((user) =>
        user.id === userId ? (projects = user.projectList) : null
      );
      return projects;
    },
    [userPageState]
  );

  const getDropdownItems = useCallback(
    (status: string) => {
      let items = userPageState.actionsDropdown
        .filter((item) => {
          if (status === "Deleted" && item.value === "deletePermanently") {
            return true; //(item.value !== "deleteUser")
          } else if (status === "Invited" && item.value === "reInviteUser") {
            return true;
          } else if (status !== "Invited" && item.value === "reInviteUser") {
            return false;
          } else if (item.value === "deletePermanently") {
            return false;
          } else if (status === "Deleted") {
            return false;
          } else {
            return true;
          }
        })
        .map((item) => {
          if (status === "Suspended") {
            return {
              ...item,
              value:
                item.value == "suspendAccess" ? "restoreAccess" : item.value,
              title:
                item.value == "suspendAccess" ? "Restore Access" : item.title,
            };
          } else {
            return item;
          }
        });
      return items;
    },
    [userPageState]
  );

  const unSelectUsers = useCallback(() => {
    let users = userPageState.users.map((user) => ({
      ...user,
      checked: false,
    }));
    updateUserPage({ users });
  }, [userPageState]);

  return useMemo(
    () => ({
      userPageState,
      getUsers,
      getProjects,
      getDropdownItems,
      updateUserPage,
      getUserInfo,
      getProjectsName,
      unSelectUsers,
      getAssignedProjects,
    }),
    [
      userPageState,
      getUsers,
      getProjects,
      getDropdownItems,
      updateUserPage,
      getUserInfo,
      getProjectsName,
      unSelectUsers,
      getAssignedProjects,
    ]
  );
};

export default useUserPage;
