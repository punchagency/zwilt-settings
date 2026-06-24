import { atom } from "recoil";

export const tableHeaders = [
  {
    id: 1,
    title: "Member",
    flexValue: 3,
  },
  {
    id: 2,
    title: "Mon, June 10, 2023",
    flexValue: 2,
  },
  {
    id: 3,
    title: "Tue, June 10, 2023",
    flexValue: 2,
  },
  {
    id: 4,
    title: "Wed, June 11, 2023",
    flexValue: 2,
  },
  {
    id: 5,
    title: "Thu, June 12, 2023",
    flexValue: 2,
  },
  {
    id: 6,
    title: "Fri, June 13, 2023",
    flexValue: 2,
  },
  {
    id: 7,
    title: "Sat, June 14, 2023",
    flexValue: 2,
  },
  {
    id: 8,
    title: "Sun, June 15, 2023",
    flexValue: 2,
  },
  {
    id: 9,
    title: "Total Worked",
    flexValue: 2,
  },
  {
    id: 10,
    title: "Activity",
    flexValue: 1,
  },
];

interface ITableHeader {
  id: number;
  title: string;
  flexValue: number;
}

interface ITableData {
  rating: number;
  name: string;
  image: string;
  activity: any[];
}

interface chartData {
  id: string | number;
  user: { name: string };
  time: number;
}

interface IDailyTotalsPageData {
  chartData: chartData[];
  timeAndActivity: ITableData[];
  tableHeaders: ITableHeader[];
  membersWorked: number;
  averageHourPerMember: number;
  averageActivity: number;
  dateRange: { startDate: string; endDate: string };
  stackedBarChartData?: any;
  selectedLocation?: string;
  selectedMemberFilter: number; // 1 = Only Me, 2 = All Members
  projectsWorkedByDate: any[];
}

export const defaultDailyTotalsPageState = {
  chartData: [],
  timeAndActivity: [],
  tableHeaders: tableHeaders,
  membersWorked: 0,
  averageHourPerMember: 0,
  averageActivity: 0,
  dateRange: {
    startDate: new Date().toDateString(),
    endDate: new Date().toDateString(),
  },
  stackedBarChartData: {
    manualTimeData: [],
    workedTimeData: [],
    xAxislabels: [],
    tooltipData: [],
  },
  selectedLocation: "",
  selectedMemberFilter: 2,
  projectsWorkedByDate: [],
};

const dailyTotalsPageAtom = atom<IDailyTotalsPageData>({
  key: "daily-totals-page-atom",
  default: defaultDailyTotalsPageState,
});

export default dailyTotalsPageAtom;
