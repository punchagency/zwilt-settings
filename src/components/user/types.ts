export interface IUser {
  checked: boolean;
  title: string;
  id: string;
  image: string;
  name: string;
  firstName: string;
  lastName: string;
  designation: string;
  role: string;
  projectList: any[];
  numOfProjects: number;
  email: string;
  location: string;
  date: string;
  status: string;
  apps?: string[];
  rawRole?: string;
  source?: string;
}

export interface IAttendanceRow {
  user: string;
  id: string;
  image: string;
  checked: boolean;
  project: string;
  totalTime: string;
  started_at: string;
  stopped_at: string;
  activity: string;
}

export interface IProject {
  id: string;
  name: string;
  status?: string;
}

export interface IActionsDropdown {
  id: number;
  title: string;
  value: string;
}

export interface IUserPageData {
  users: IUser[];
  projects: IProject[];
  actionsDropdown: IActionsDropdown[];
  selectedUsers: string[];
  activeTab: number;
}

export interface IUserRow {
  checked: boolean;
  id: string;
  image: string;
  name: string;
  designation: string;
  role: string;
  numOfProjects: string;
  email: string;
  location: string;
  date: string;
  status: string;
  source?: string;
}
