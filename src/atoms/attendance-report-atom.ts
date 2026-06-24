import { atom } from "recoil";

interface IMinute {
  minute: number;
}

interface IHours {
  hour: number;
  minutes: IMinute[];
}

export type attendance = {
  attendanceData: {
    tracker?: {
      totalActiveSeconds?: number;
      totalSecondsLogged?: number;
      trackingDate?: string;
      hours?: IHours[];
    };
    userData: {
      _id?: string;
      firstName?: string;
      lastName?: string;
      profileImg?: string;
      projects?: string[];
    };
  };
};

interface ITotalResult {
  tracker?: {
    totalActiveSeconds?: number;
    totalSecondsLogged?: number;
    trackingDate?: string;
    hours?: IHours[];
  };
  userData: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    profileImg?: string;
    projects: string[];
  };
}

interface IAttendanceR {
  page?: number;
  totalResultCount?: number;
  totalResult?: ITotalResult[];
  attendance?: attendance[];
  timeActivityData?: any;
}

export const defaultAttendancePageState = {
  page: 0,
  totalResultCount: 0,
  totalResult: [],
  attendance: [],
  timeActivityData: [],
};

const AttendancePageAtom = atom<IAttendanceR>({
  key: "attendance-report-atom",
  default: defaultAttendancePageState,
});

export default AttendancePageAtom;
