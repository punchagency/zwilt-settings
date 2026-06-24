import { atom } from "recoil";

interface IGroup {
  id: String;
  time: String;
  activity: String;
  idle: number;
  total: number;
}

interface IGroupByMember extends IGroup {
  date: String;
  project: String[];
  user: {
    name: String;
    image: String;
  };
}

interface IGroupByProjectOrDate extends IGroup {
  date: String;
  members: number;
  project: {
    image: String;
    name: String;
  };
  user: {
    name: String;
    image: String;
  };
}

interface IGroupByProject {
  project: String;
  data: IGroupByProjectOrDate[];
}

interface IGroupByDate {
  date: String;
  data: IGroupByProjectOrDate[];
}

interface ITimeAndActivityPageData {
  stackedBarChartData: {
    manualTimeData: number[];
    idleTimeData: number[];
    workedTimeData: number[];
    xAxislabels: string[];
    tooltipData: number[];
  };
  dateRange: {
    startDate: string;
    endDate: string;
  };
  groupByValue: String;
  groupByDate: IGroupByDate[];
  groupByProject: IGroupByProject[];
  groupByMember: IGroupByMember[];
  workedThisWeek: String;
  weeklyActivity: String;
  totalHoursPerDay: String;
  idleThisWeek?: String;
  dailyStats?: any[];
}

export const defaultTimeAndActivityPageState = {
  groupByDate: [],
  groupByProject: [],
  groupByMember: [],
  groupByValue: "groupByDate",
  dateRange: {
    startDate: new Date().toDateString(),
    endDate: new Date().toDateString(),
  },
  stackedBarChartData: {
    manualTimeData: [],
    idleTimeData: [],
    workedTimeData: [],
    xAxislabels: [],
    tooltipData: [],
  },
  workedThisWeek: "",
  weeklyActivity: "",
  totalHoursPerDay: "",
  idleThisWeek: "",
  dailyStats: [],
};

const timeAndActivityPageAtom = atom<ITimeAndActivityPageData>({
  key: "time-and-activity-page-atom",
  default: defaultTimeAndActivityPageState,
});

export default timeAndActivityPageAtom;
