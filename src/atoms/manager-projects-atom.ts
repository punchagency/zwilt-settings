import { atom } from "recoil";

export interface ManagerProject {
  _id: string;
  projectName: string;
  projectImage?: string | null;
  status?: string;
}

const managerProjectsAtom = atom<ManagerProject[]>({
  key: "managerProjectsAtom",
  default: [],
});

export default managerProjectsAtom;
