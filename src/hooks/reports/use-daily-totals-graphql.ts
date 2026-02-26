import React, { useCallback, useEffect, useMemo } from "react";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";

import useDailyTotals from "./use-daily-totals";

import {
  GET_DAILY_TOTALS,
  GET_DAILY_TOTALS_GROUPED_DATA,
} from "@/graphql/queries/reports";
import { useRecoilState } from "recoil";
import userAtom from "@/atoms/user-atom";
import { generateHeaders, removeTimeValue } from "@/utils/date-range";
import { dailyTotalsData } from "./daily-totals-data";
import { dailyTotalsDataMini } from "./daily-totals-data-mini";

const useDailyTotalsGraphql = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const { updateDailyTotalsPage, getDateRange, dailyTotalsPageState } =
    useDailyTotals();

  const [getDailyTotals, { loading: loading, error: error, data: data }] =
    useLazyQuery(GET_DAILY_TOTALS, {
      context: { clientName: "tracker" },
      fetchPolicy: "network-only",
    });

  const convertToHoursAndMins = (
    hours: number,
    minutes: number,
    seconds: number,
  ) => {
    let hold = seconds / 60;
    let mins = (minutes + hold) / 60;
    let hrs = hours + mins;

    return hrs;
  };

  const convertToSeconds = (
    hours: number,
    minutes: number,
    seconds: number,
  ) => {
    let hold = hours * 60 + minutes;
    hold = hold * 60 + seconds;
    return hold;
  };
  useEffect(() => {
    const response = data?.getReportingTodayAnalytics?.data;

    console.log("eeed", response);

    let unique: any[] = [];
    if (response) {
      // Safely extract totalHoursPerUser with multiple checks
      let totalHoursPerUser: any[] = [];
      try {
        if (
          response?.totalHoursPerUser != null &&
          Array.isArray(response.totalHoursPerUser)
        ) {
          totalHoursPerUser = [...response.totalHoursPerUser];
        }
      } catch (error) {
        console.error("Error processing totalHoursPerUser:", error);
        totalHoursPerUser = [];
      }

      // Create a map to group by user ID and aggregate their time properly
      const userTimeMap = new Map();

      totalHoursPerUser.forEach((hour: any) => {
        const userId = hour?.user?._id;
        const userName =
          (hour?.user?.firstName || "") + " " + (hour?.user?.lastName || "");

        if (!userTimeMap.has(userId)) {
          userTimeMap.set(userId, {
            user: {
              id: userId,
              name: userName,
              email: hour?.user?.email,
            },
            time: {
              hours: 0,
              minutes: 0,
              seconds: 0,
            },
            idleTime: {
              hours: 0,
              minutes: 0,
              seconds: 0,
            },
            manualTime: {
              hours: 0,
              minutes: 0,
              seconds: 0,
            },
            timeWorked: {
              hours: 0,
              minutes: 0,
              seconds: 0,
            },
          });
        }

        const userEntry = userTimeMap.get(userId);

        // Add time values properly
        userEntry.time.hours += Number(hour.time?.hours) || 0;
        userEntry.time.minutes += Number(hour.time?.minutes) || 0;
        userEntry.time.seconds += Number(hour.time?.seconds) || 0;

        userEntry.idleTime.hours += Number(hour.idleTime?.hours) || 0;
        userEntry.idleTime.minutes += Number(hour.idleTime?.minutes) || 0;
        userEntry.idleTime.seconds += Number(hour.idleTime?.seconds) || 0;

        userEntry.manualTime.hours += Number(hour.manualTimeAdded?.hours) || 0;
        userEntry.manualTime.minutes +=
          Number(hour.manualTimeAdded?.minutes) || 0;
        userEntry.manualTime.seconds +=
          Number(hour.manualTimeAdded?.seconds) || 0;

        userEntry.timeWorked.hours += Number(hour.timeWorked?.hours) || 0;
        userEntry.timeWorked.minutes += Number(hour.timeWorked?.minutes) || 0;
        userEntry.timeWorked.seconds += Number(hour.timeWorked?.seconds) || 0;
      });

      // Convert the map values to array and process
      const aggregatedUsers = Array.from(userTimeMap.values());

      // Sort by name
      aggregatedUsers.sort((a: any, b: any) => {
        return a.user.name < b.user.name ? -1 : 1;
      });

      aggregatedUsers.forEach((userEntry: any) => {
        // Normalize time values (handle overflow of minutes/seconds)
        const normalizeTime = (timeObj: any) => {
          let totalSeconds =
            timeObj.seconds + timeObj.minutes * 60 + timeObj.hours * 3600;
          return totalSeconds / 3600; // Convert to hours as decimal
        };

        const totalHours = normalizeTime(userEntry.time);
        const idleHours = normalizeTime(userEntry.idleTime);
        const manualHours = normalizeTime(userEntry.manualTime);
        const workedHours = normalizeTime(userEntry.timeWorked);

        unique.push({
          user: userEntry.user,
          time: totalHours,
          idleTime: idleHours,
          manualTime: manualHours,
          timeWorked: workedHours,
        });
      });
      let labels: string[] = [];
      let names: any[] = [];
      let manualTime: any[] = [],
        idleTime: any[] = [],
        workedTime: any[] = [];
      const getInitials = (fullName: string) => {
        const parts = fullName.trim().split(" ").filter(Boolean);
        if (parts.length === 0) return "";
        if (parts.length === 1) {
          return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[1][0]).toUpperCase();
      };

      unique.forEach((item) => {
        labels.push(getInitials(item.user.name));
        // Convert hours back to proper format for chart display
        manualTime.push(item.manualTime);
        idleTime.push(item.idleTime);
        workedTime.push(item.time);
        names.push({ name: item.user.name, time: item.time });
      });

      updateDailyTotalsPage({
        chartData: unique,
        averageHourPerMember: response?.averageHoursPerMember || 0,
        membersWorked: Array.isArray(response?.membersWorked)
          ? response.membersWorked.length
          : 0,
        averageActivity: response?.averageActivity || 0,
        // timeAndActivity: tableData,
        stackedBarChartData: {
          manualTimeData: manualTime,
          workedTimeData: workedTime,
          xAxislabels: labels,
          tooltipData: names,
        },
        projectsWorkedByDate: Array.isArray(response?.projectsWorkedByDate)
          ? response.projectsWorkedByDate
          : [],
      });
    }
  }, [data]);

  const runGetDailyTotalsQuery = useCallback(
    (startDate?: string, endDate?: string) => {
      console.log("ffl 4", startDate, endDate);
      let values: any = {};
      if (startDate === new Date().toDateString()) {
        getDailyTotals({
          variables: {
            input: {
              user: user.userData?._id,
              role: user.userData?.role,
              organization: "65169b7ef0410efa3245d795",
            },
          },
        });
      } else {
        getDailyTotals({
          variables: {
            input: {
              user: user.userData?._id,
              dateRange: [startDate, endDate],
              role: user.userData?.role,
              organization: "65169b7ef0410efa3245d795",
            },
          },
        });
      }

      console.log("ffl 3", startDate, endDate);
    },
    [],
  );

  const [
    getDailyTotalsGroupedData,
    { loading: groupedDataLoading, error: groupedDataError, data: groupedData },
  ] = useLazyQuery(GET_DAILY_TOTALS_GROUPED_DATA, {
    context: { clientName: "tracker" },
    fetchPolicy: "network-only",
  });

  const getFirstAndLastDay = () => {
    const today = new Date();

    // ✅ Get the first day of the current week (Sunday)
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));

    // ✅ Get the last day of the current week (Saturday)
    const lastDay = new Date(
      today.setDate(today.getDate() - today.getDay() + 6),
    );

    return { sat: lastDay, sun: firstDay };
  };

  let days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  useEffect(() => {
    //groupedData?.getDailyTotalGroupedDataTimeAndActivity?.data
    const response = groupedData?.getDailyTotalGroupedDataTimeAndActivity?.data;
    // const response =
    //   dailyTotalsDataMini.data.getDailyTotalGroupedDataTimeAndActivity.data;
    if (response && Array.isArray(response)) {
      let { startDate, endDate } = getDateRange();
      let headers = generateHeaders(startDate, endDate);

      let formatted = response.map((item: any) => {
        // Extract location from entity if it exists
        let location = "";

        try {
          // If entity is an object
          if (item.entity && typeof item.entity === "object") {
            if (item.entity.location) {
              location = item.entity.location;
            } else if (item.entity.user && item.entity.user.location) {
              location = item.entity.user.location;
            }
          }
        } catch (error) {
          console.error("Error extracting location:", error);
        }

        return {
          rating: 0, // Default rating value
          image: item?.entity?.profileImg || null,
          name: (
            (item?.entity?.firstName || "") +
            " " +
            (item?.entity?.lastName || "")
          ).trim(),
          location: location.toLowerCase().trim(), // Normalize location
          userId: item?.entity?._id || item?.entity?.user?._id || null,
          activity: headers.map((header) => {
            let vals = {
              total: 0,
              active: 0,
              idle: 0,
              date: header,
              breakTime: 0,
            };
            let match = false;
            if (Array.isArray(item?.activity)) {
              item.activity.forEach((activity: any) => {
                console.log(
                  header,
                  activity?.trackingDate,
                  activity?.trackingDate
                    ? removeTimeValue(activity.trackingDate)
                    : "",
                  "daily totals date value",
                );
                if (
                  activity?.trackingDate &&
                  header === removeTimeValue(activity.trackingDate)
                ) {
                  let sum = 0,
                    activeSum = 0,
                    idleSum = 0,
                    breakSum = 0;
                  if (
                    activity?.tracker?.trackedData &&
                    Array.isArray(activity.tracker.trackedData)
                  ) {
                    activity.tracker.trackedData.forEach((data: any) => {
                      sum += data?.totalSecondsLogged || 0;
                      activeSum +=
                        (data?.totalActiveSeconds || 0) +
                        (data?.manualTimeAdded || 0);
                      idleSum += data?.totalInActiveSeconds || 0;
                      // Extract break seconds directly from trackedData
                      breakSum += data?.totalBreakSeconds || 0;
                    });
                  }
                  vals = {
                    total: sum,
                    active: activeSum,
                    idle: idleSum,
                    date: header,
                    breakTime: breakSum,
                  };
                } else {
                  // vals = {
                  //   total: 0,
                  //   active: 0,
                  //   idle: 0,
                  //   date: header,
                  // };
                }
              });
            }
            return vals;
          }),
        };
      });
      let headerVal = [
        {
          id: 1,
          title: "Member",
          flexValue: 3,
        },
      ];
      for (let i = 0; i < headers.length; i++) {
        headerVal.push({
          id: i + 1,
          title: headers[i],
          flexValue: 2,
        });
      }

      const isSingleDate = headers.length === 1;

      headerVal.push(
        {
          id: 9,
          title: isSingleDate ? "Break Taken" : "Total Worked",
          flexValue: 2,
        },
        {
          id: 10,
          title: "Activity",
          flexValue: 1,
        },
      );
      updateDailyTotalsPage({
        timeAndActivity: formatted,
        tableHeaders: headerVal,
      });
    }
  }, [groupedData]);
  const runGetDailyTotalsGroupedDataQuery = useCallback(
    (startDate?: string, endDate?: string) => {
      if (!startDate || !endDate) {
        let val = getDateRange();
        startDate = val.startDate;
        endDate = val.endDate;
      }
      getDailyTotalsGroupedData({
        variables: {
          input: {
            user: user.userData?._id,
            role: user.userData?.role,
            dateRange: [startDate, endDate],
            organization: "65169b7ef0410efa3245d795",
            // Remove location parameter - fetch all data
          },
        },
      });
    },
    [user, getDateRange], // Remove selectedLocation from dependencies
  );

  return useMemo(
    () => ({
      runGetDailyTotalsQuery,
      loading,
      runGetDailyTotalsGroupedDataQuery,
      groupedDataLoading,
      getFirstAndLastDay,
    }),
    [
      runGetDailyTotalsQuery,
      loading,
      runGetDailyTotalsGroupedDataQuery,
      groupedDataLoading,
      getFirstAndLastDay,
    ],
  );
};

export default useDailyTotalsGraphql;
