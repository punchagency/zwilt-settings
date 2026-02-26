import userAtom from "@/atoms/user-atom";
import { useRecoilState } from "recoil";
import useTimeAndActivityReport from "./use-time-and-activity-report";
import { useLazyQuery } from "@apollo/react-hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GET_TIME_AND_ACTIVITY_GROUPBY,
  GET_TIME_AND_ACTIVITY_REPORT,
} from "@/graphql/queries/report";
import {
  generateHeaders,
  removeTimeValue,
  sumTimeValuesByDay,
} from "@/utils/date-range";
import { convertSeconds, convertTimeToSeconds } from "@/utils/time";
import { GET_PROJECTS } from "@/graphql/queries/project";
import { GetUserDailyStatsForWeek } from "@/graphql/queries/activity";
import { useApolloClient } from "@apollo/react-hooks";
import { displayTime } from "@/utils/helper-functions";

const removeDuplicatesByKey = (array: any[], keyFn: (item: any) => string) => {
  const seen = new Set();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const useTimeAndActivityGraphql: any = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const {
    updateTimeAndActivityPage,
    getDateRange,
    timeAndActivityPageState,
    getTimeAndActivityPageState,
  } = useTimeAndActivityReport();
  const [filterByValue, setFilterByValue] = useState("groupByDate");
  const apolloClient = useApolloClient();

  const [
    getTimeAndActivityReport,
    { loading: chartLoading, error: error, data: data },
  ] = useLazyQuery(GET_TIME_AND_ACTIVITY_REPORT, {
    context: { clientName: "tracker" },
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    const response = data?.getReportingAnalytics?.data?.totalHoursPerDay;

    if (response) {
      updateTimeAndActivityPage({
        workedThisWeek: data?.getReportingAnalytics?.data?.workedThisWeek || "",
        weeklyActivity: data?.getReportingAnalytics?.data?.weeklyActivity || "",
        idleThisWeek: data?.getReportingAnalytics?.data?.idleThisWeek || "",
      });

      const { startDate, endDate } = getDateRange();

      let headers = generateHeaders(startDate, endDate);
      let totals: any[] = [];

      headers.forEach((header) => {
        let vals = {
          total: 0,
          active: 0,
          idle: 0,
          manual: 0,
          break: 0,
          date: header,
        };

        const dayActivities = response.filter(
          (activity: any) => header === removeTimeValue(activity.date),
        );

        if (dayActivities && dayActivities.length > 0) {
          dayActivities.forEach((dayActivity: any) => {
            vals.total +=
              Number(dayActivity.time.hours) +
              Number(dayActivity.time.minutes) / 60 +
              Number(dayActivity.time.seconds) / 3600;

            vals.active +=
              Number(dayActivity.timeWorked.hours) +
              Number(dayActivity.timeWorked.minutes) / 60 +
              Number(dayActivity.timeWorked.seconds) / 3600;

            vals.idle +=
              Number(dayActivity.idleTime.hours) +
              Number(dayActivity.idleTime.minutes) / 60 +
              Number(dayActivity.idleTime.seconds) / 3600;

            vals.manual +=
              Number(dayActivity.manualTimeAdded.hours) +
              Number(dayActivity.manualTimeAdded.minutes) / 60 +
              Number(dayActivity.manualTimeAdded.seconds) / 3600;

            if (dayActivity.breakTime) {
              vals.break +=
                Number(dayActivity.breakTime.hours) +
                Number(dayActivity.breakTime.minutes) / 60 +
                Number(dayActivity.breakTime.seconds) / 3600;
            }
          });
        }

        totals.push(vals);
      });

      updateTimeAndActivityPage({
        stackedBarChartData: {
          manualTimeData: totals.map((time) => time.manual),
          idleTimeData: totals.map((time) => time.idle),
          workedTimeData: totals.map((time) => time.total),
          activeTimeData: totals.map((time) => time.active),
          breakTimeData: totals.map((time) => time.break),
          xAxislabels: headers.map((header) => {
            const date = new Date(header);
            return date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
          }),
          tooltipData: [],
        },
      });
    }
  }, [data]);

  const runGetTimeAndActivityReport = useCallback(
    (customStartDate?: string, customEndDate?: string, customRole?: string) => {
      const { startDate, endDate } = getDateRange();
      const finalStartDate = customStartDate ?? startDate;
      const finalEndDate = customEndDate ?? endDate;
      const finalRole = customRole ?? user.userData?.role;

      getTimeAndActivityReport({
        variables: {
          input: {
            user: user.userData?._id,
            role: finalRole,
            dateRange: [finalStartDate, finalEndDate],
            organization: "65169b7ef0410efa3245d795",
          },
        },
      });
    },
    [timeAndActivityPageState],
  );

  const runGetTimeAndActivityReportOnlyMe = useCallback(
    (customStartDate?: string, customEndDate?: string) => {
      const { startDate, endDate } = getDateRange();
      const finalStartDate = customStartDate ?? startDate;
      const finalEndDate = customEndDate ?? endDate;

      getTimeAndActivityReport({
        variables: {
          input: {
            user: user.userData?._id,
            role: "USER",
            dateRange: [finalStartDate, finalEndDate],
            organization: "65169b7ef0410efa3245d795",
          },
        },
      });
    },
    [timeAndActivityPageState],
  );

  const [
    getTimeAndActivityTableData,
    {
      loading: groupByMemberLoading,
      data: groupByResponseData,
      error: groupByError,
    },
  ] = useLazyQuery(GET_TIME_AND_ACTIVITY_GROUPBY, {
    context: { clientName: "tracker" },
  });
  useEffect(() => {
    const response = groupByResponseData?.getGroupedDataTimeAndActivity?.data;

    if (response) {
      updateTimeAndActivityPage({
        groupByProject: [],
        groupByMember: [],
        groupByDate: [],
      });

      let groupByData: any[] = [];

      if (filterByValue === "groupByProject") {
        response.forEach((item: any) => {
          if (item?.entity?.name) {
            item.entitySubGroup.forEach((subGroup: any) => {
              subGroup.trackedData.forEach((tracked: any) => {
                groupByData.push({
                  id: item?.entity?.id,
                  project: {
                    name: item?.entity?.name,
                    image: item?.entity?.image ? item?.entity?.image : "",
                  },
                  user: {
                    name:
                      tracked?.user?.firstName + " " + tracked?.user?.lastName,
                    image: tracked?.user?.profileImg,
                  },
                  userId: tracked?.user?._id,
                  manualTime: tracked?.manualTimeAdded
                    ? tracked?.manualTimeAdded
                    : 0,
                  time: convertSeconds(tracked?.totalSecondsLogged),
                  idlePercent: (
                    (tracked?.totalIdleSeconds / tracked?.totalSecondsLogged) *
                    100
                  ).toFixed(2),
                  idleTime: convertSeconds(tracked?.totalIdleSeconds),
                  active: (
                    (tracked?.totalActiveSeconds /
                      tracked?.totalSecondsLogged) *
                    100
                  ).toFixed(2),
                  date: removeTimeValue(subGroup?.date),
                });
              });
            });
          }
        });

        const deduplicatedData = removeDuplicatesByKey(
          groupByData,
          (item) => `${item.id}_${item.user.name}_${item.date}`,
        );

        let { startDate, endDate } = getDateRange();
        let headers = generateHeaders(startDate, endDate);

        const distinct = deduplicatedData
          .map((item: any) => item.id)
          .filter(
            (name, index, currentVal) => currentVal.indexOf(name) === index,
          );

        let groupByProject: any[] = [];
        distinct.forEach((id) => {
          let values: any[] = [];
          let name = "";
          let projectImage = "";
          deduplicatedData.forEach((data) => {
            if (id === data.id) {
              values.push(data);
              name = data.project.name;
              projectImage = data.project.image;
            }
          });
          groupByProject.push({
            project: {
              name: name,
              image: projectImage,
            },
            data: values,
          });
        });
        updateTimeAndActivityPage({ groupByProject: groupByProject });
      } else if (filterByValue === "groupByMember") {
        response.forEach((item: any) => {
          if (item?.entity?.firstName || item?.entity?.lastName) {
            item.entitySubGroup.forEach((subGroup: any) => {
              subGroup.trackedData.forEach((tracked: any) => {
                let projectName = "Unspecified";
                let projectId = "unknown";

                if (
                  tracked?.project &&
                  Array.isArray(tracked.project) &&
                  tracked.project.length > 0
                ) {
                  const projectData = tracked.project[0];
                  if (projectData && projectData.name) {
                    projectName = projectData.name;
                    projectId = projectData.id || projectData._id || "unknown";
                  }
                }

                if (projectName === "Unspecified" && subGroup?.name) {
                  projectName = subGroup.name;
                  projectId = subGroup.id || "unknown";
                }
                groupByData.push({
                  id: item?.entity?._id,
                  userId: item?.entity?._id,
                  project: {
                    name: projectName,
                    _id: projectId,
                  },
                  user: {
                    name:
                      item?.entity?.firstName + " " + item?.entity?.lastName,
                    image: item?.entity?.profileImg,
                  },
                  manualTime: tracked?.manualTimeAdded
                    ? tracked?.manualTimeAdded
                    : 0,
                  time: convertSeconds(
                    Number(tracked?.totalSecondsLogged) || 0,
                  ),
                  idlePercent: (
                    ((Number(tracked?.totalIdleSeconds) || 0) /
                      (Number(tracked?.totalSecondsLogged) || 1)) *
                    100
                  ).toFixed(2),
                  idleTime: convertSeconds(
                    Number(tracked?.totalIdleSeconds) || 0,
                  ),
                  active: (
                    ((Number(tracked?.totalActiveSeconds) || 0) /
                      (Number(tracked?.totalSecondsLogged) || 1)) *
                    100
                  ).toFixed(2),
                  date: removeTimeValue(subGroup?.date || tracked?.date),
                });
              });
            });
          }
        });

        const deduplicatedData = removeDuplicatesByKey(
          groupByData,
          (item) => `${item.id}_${item.project.name}_${item.date}`,
        );

        const distinct = deduplicatedData
          .map((item: any) => item.id)
          .filter(
            (name, index, currentVal) => currentVal.indexOf(name) === index,
          );

        let groupByMember: any[] = [];
        distinct.forEach((id) => {
          let values: any[] = [];
          let name = "";
          deduplicatedData.forEach((data) => {
            if (id === data.id) {
              values.push(data);
              name = data.user.name;
            }
          });
          groupByMember.push({
            userId: id,
            user: name,
            data: values,
          });
        });

        updateTimeAndActivityPage({ groupByMember: groupByMember });
      } else if (filterByValue === "groupByDate") {
        // Process all data first, outside of any loops to avoid duplicates
        response.forEach((item: any) => {
          item.entitySubGroup.forEach((subGroup: any) => {
            subGroup.trackedData.forEach((tracked: any) => {
              groupByData.push({
                id: subGroup?.id,
                userId: tracked?.user?._id,
                project: {
                  name: subGroup?.name,
                  image: "",
                  _id: Array.isArray(subGroup?.id)
                    ? subGroup?.id[0]
                    : subGroup?.id,
                },
                user: {
                  _id: tracked?.user?._id,
                  name:
                    tracked?.user?.firstName + " " + tracked?.user?.lastName,
                  image: tracked?.user?.profileImg,
                },
                manualTime: tracked?.manualTimeAdded
                  ? tracked?.manualTimeAdded
                  : 0,
                time: convertSeconds(tracked?.totalSecondsLogged),
                idlePercent: (
                  (tracked?.totalIdleSeconds / tracked?.totalSecondsLogged) *
                  100
                ).toFixed(2),
                idleTime: convertSeconds(tracked?.totalIdleSeconds),
                active: (
                  (tracked?.totalActiveSeconds / tracked?.totalSecondsLogged) *
                  100
                ).toFixed(2),
                date: item?.entity,
              });
            });
          });
        });

        const deduplicatedData = removeDuplicatesByKey(
          groupByData,
          (item) => `${item.userId}_${item.project._id}_${item.date}`,
        );

        let { startDate, endDate } = getDateRange();
        let headers = generateHeaders(startDate, endDate);
        let groupByDate: any[] = [];

        headers.forEach((header) => {
          let values: any[] = [];
          deduplicatedData.forEach((data) => {
            if (header === removeTimeValue(data.date)) {
              values.push(data);
            }
          });
          groupByDate.push({
            date: header,
            data: values,
          });
        });

        updateTimeAndActivityPage({ groupByDate: groupByDate });
      }
    }
  }, [groupByResponseData]);

  const runGetTimeAndActivityTableData = useCallback(
    (
      filterBy: string,
      startDate: string,
      endDate: string,
      location?: string,
      userId?: string,
      role?: string,
    ) => {
      let groupBy =
        filterBy == "groupByProject"
          ? "PROJECT"
          : filterBy === "groupByMember"
            ? "USER"
            : "DATE";
      setFilterByValue(filterBy);
      getTimeAndActivityTableData({
        variables: {
          input: {
            filterBy: groupBy, //"USER",
            dateRange: [startDate, endDate],
            organization: "65169b7ef0410efa3245d795",
            location: location || undefined, // Only add location if it's provided and not empty
            user: userId || undefined, // Add user filter for "Only Me" mode
            role: role || undefined, // Add role for proper data filtering
          },
        },
      });
    },
    [timeAndActivityPageState, updateTimeAndActivityPage],
  );

  const [
    getProjectsData,
    { loading: projectsLoading, data: projectsData, error: projectsError },
  ] = useLazyQuery(GET_PROJECTS, {
    context: { clientName: "tracker" },
    onError: () => {
      console.log("from time and activity gql.ts");
    },
  });

  useEffect(() => {
    const response = projectsData;
  }, [projectsData]);

  const runGetProjectsQuery = useCallback(() => {
    getProjectsData({
      variables: {
        input: {
          status: "ACTIVE",
          organization: "65169b7ef0410efa3245d795",
        },
      },
    });
  }, []);

  const [getDailyStatsLoading, setGetDailyStatsLoading] = useState(false);

  const fetchDailyStats = async (selectedDate: string) => {
    setGetDailyStatsLoading(true);
    try {
      const { data } = await apolloClient.query({
        query: GetUserDailyStatsForWeek,
        variables: {
          selectedDate,
          userId: user?.userData?._id,
        },
        fetchPolicy: "network-only",
      });

      if (data?.getUserDailyStatsForWeek) {
        const dailyStats = data.getUserDailyStatsForWeek;

        const totalSecondsLogged = dailyStats.reduce(
          (acc: number, day: any) => acc + day.totalSecondsLogged,
          0,
        );
        const totalActiveSeconds = dailyStats.reduce(
          (acc: number, day: any) => acc + day.totalActiveSeconds,
          0,
        );
        const totalIdleSeconds = dailyStats.reduce(
          (acc: number, day: any) => acc + day.totalIdleSeconds,
          0,
        );

        const activityPercentage =
          totalSecondsLogged > 0
            ? Math.round((totalActiveSeconds / totalSecondsLogged) * 100)
            : 0;

        updateTimeAndActivityPage({
          workedThisWeek: displayTime(totalSecondsLogged, "digit"),
          weeklyActivity: activityPercentage.toString(),
          idleThisWeek: displayTime(totalIdleSeconds, "digit"),
          dailyStats: dailyStats,
        });
      }
    } catch (error) {
      console.error("Error fetching daily stats:", error);
    } finally {
      setGetDailyStatsLoading(false);
    }
  };

  return useMemo(
    () => ({
      runGetTimeAndActivityReport,
      runGetTimeAndActivityReportOnlyMe,
      runGetTimeAndActivityTableData,
      chartLoading,
      groupByMemberLoading,
      runGetProjectsQuery,
      fetchDailyStats,
      getDailyStatsLoading,
    }),
    [
      runGetTimeAndActivityReport,
      runGetTimeAndActivityReportOnlyMe,
      runGetTimeAndActivityTableData,
      chartLoading,
      groupByMemberLoading,
      runGetProjectsQuery,
      fetchDailyStats,
      getDailyStatsLoading,
    ],
  );
};

export default useTimeAndActivityGraphql;
