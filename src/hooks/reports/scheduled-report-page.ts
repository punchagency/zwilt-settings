import userPageAtom, { defaultUserPageState } from "@/atoms/user-page-atom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";

const useScheduledReportPage = () => {
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

//   useEffect(() => {
//     setUserPageState(recoilState);
//   }, [recoilState]);

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
    (projectList: string[]): (string | undefined)[] => {
      let names = [];
      names = projectList.map((project) => {
        let projectVal = userPageState.projects.find(
          (val) => val.id === project
        );
        return projectVal?.name;
      });
      names = names.length > 0 ? names : [];
      return names;
    },
    [userPageState]
  );

  const getDropdownItems = useCallback(
    (status: string) => {
      let items = userPageState.actionsDropdown
        .filter((item) => {
          if (status === "Deleted") {
            return false //(item.value !== "deleteUser")
          }else{
            return true
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
    ]
  );
};

export default useScheduledReportPage;
