import { IUserPageData } from "@/components/user/types";
import { atom } from "recoil";

export const defaultUserPageState = {
  users: [],
  projects: [],
  selectedUsers: [],
  actionsDropdown: [
    {
      id: 1,
      title: "Edit User",
      value: "editUser",
    },
    {
      id: 2,
      title: "Assign Projects",
      value: "assignProjects",
    },
    {
      id: 2,
      title: "Reinvite User",
      value: "reInviteUser",
    },
    {
      id: 3,
      title: "Suspend Access",
      value: "suspendAccess",
    },
    {
      id: 3,
      title: "Delete User",
      value: "deleteUser",
    },
    {
      id: 3,
      title: "Delete Permanently",
      value: "deletePermanently",
    },
  ],
  activeTab: 0,
};

const userPageAtom = atom<IUserPageData>({
  key: "users-page-atom",
  default: defaultUserPageState,
});

export default userPageAtom;
