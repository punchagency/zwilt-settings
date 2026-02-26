import { atom } from "recoil";

export interface ITeam {
  _id: string;
  name: string;
  location: string;
  description?: string;
  members: any[];
  projects: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ITeamState {
  teams: ITeam[];
}

const defaultTeamState: ITeamState = {
  teams: [],
};

const teamAtom = atom<ITeamState>({
  key: "team-atom",
  default: defaultTeamState,
});

export default teamAtom;
export { defaultTeamState };