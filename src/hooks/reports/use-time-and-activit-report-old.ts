import React, { useCallback, useEffect, useMemo } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import useUserPage from "../user/use-user-page";
import {
  GET_GROUPBY_DATE,
  GET_GROUPBY_PROJECT,
  GET_TIME_AND_ACTIVITY_GROUPBY,
  GET_TIME_AND_ACTIVITY_REPORT,
} from "@/graphql/queries/report";
import { useRecoilValue } from "recoil";
import userAtom from "@/atoms/user-atom";
import { sumTimeValuesByDay } from "@/utils/date-range";

interface Time {
  hours: number | string;
  minutes: number | string;
  seconds: number;
}

interface TimeEntry {
  time: Time;
  date: string;
}

interface ProjectData {
  id: number;
  image: string;
  name: string;
  time: string;
  activity: string;
  idle: string;
  idleHrs: string;
}

interface DateData {
  id: number;
  date: string;
  projects: ProjectData[];
}

interface UserData {
  id: number;
  name: string;
  image: string;
  showDetails: boolean;
  totalTime: string;
  totalActivity: string;
  totalIdle: string;
  totalIdleHrs: string;
  totalProjects: number;
  dates: DateData[];
}

const useReportTimeAndActivityPageGraphql: any = () => {
  const { updateUserPage, userPageState, unSelectUsers, getUserInfo } =
    useUserPage();
  const userState = useRecoilValue(userAtom);
  const { isAuth, userData } = userState;

  const { _id, role } = userData || {};

  const { data, loading, error } = useQuery(GET_TIME_AND_ACTIVITY_REPORT, {
    variables: {
      input: {
        user: _id,
        role: role,
      },
    },
  });

  /**************Section for Chart********************* */

  const dateArray = data?.getReportingAnalytics?.data?.totalHoursPerDay;

  const chartReportData = [
    {
      label: "",
      data: sumTimeValuesByDay(dateArray || []),
      backgroundColor: "rgb(36, 75, 182)",
    },
  ];

  /************************** End of section for Chart******************************************** */

  /**************************  Section for Time and Activity Table   ********************************** */

  const [
    getUser,
    { loading: groupByMemeberLoading, data: groupByMemeberData },
  ] = useLazyQuery(GET_TIME_AND_ACTIVITY_GROUPBY);

  const groupByMemberPayload = {
    getUser,
    groupByMemeberLoading,
    groupByMemeberData,
    userId: _id,
    userRole: role,
  };

  interface GroupByMemberUser {
    _id: string;
    firstName: string;
    lastName: string;
  }

  interface GroupByMemberProject {
    id: string;
    name: string;
  }

  interface GroupByMemberTrackedData {
    trackingDate: string;
    totalSecondsLogged: number;
    totalInActiveSeconds: number;
    totalActiveSeconds: number;
    minutes: {
      minute: number;
      data: {
        activeTimeCount: number;
        inActiveTimeCount: number;
        idleTime: number;
        project: GroupByMemberProject[];
      };
    }[];
  }

  interface TrackedEntity {
    entity: GroupByMemberUser;
    entitySubGroup: {
      date: string;
      trackedData: GroupByMemberTrackedData[];
    }[];
  }

  interface OutputProject {
    id: string;
    image: number;
    name: string;
    time: string;
    activity: string;
    idle: string;
    idleHrs: string;
  }

  interface OutputDate {
    id: number;
    date: string;
    projects: OutputProject[];
  }

  interface OutputUser {
    id: number;
    name: string;
    image: number;
    showDetails: boolean;
    totalTime: string;
    totalActivity: string;
    totalIdle: string;
    totalIdleHrs: string;
    totalProjects: number;
    dates: OutputDate[];
  }

  function useGroupByMemberData(dataset: any): OutputUser[] {
    const output: OutputUser[] = [];

    dataset?.forEach((user: any, userIndex: any) => {
      var totalSecondsLogged: number = 0;
      var totalInActiveSeconds: number = 0;
      var totalActiveSeconds: number = 0;
      let totalIdleTime = 0;
      const userData: OutputUser = {
        id: userIndex + 1,
        name: `${user?.entity?.firstName} ${user?.entity?.lastName}`,
        image: user?.entity?.profileImg,
        showDetails: false,
        totalTime: "00:00:00",
        totalActivity: "0%",
        totalIdle: "0%",
        totalIdleHrs: "00:00:00",
        totalProjects: 0,
        dates: [],
      };

      user?.entitySubGroup?.forEach((subGroup: any, dateIndex: any) => {
        const dateData: OutputDate = {
          id: dateIndex + 1,
          date: new Date(subGroup?.date).toDateString(),
          projects: [],
        };

        subGroup?.trackedData?.forEach((trackedData: any) => {
          const projectTemp: any = {
            id: "",
            image: "",
            name: "",
            time: convertToTime(trackedData?.totalSecondsLogged),
            activity:
              Math.floor(
                (trackedData?.totalActiveSeconds /
                  (trackedData?.totalActiveSeconds +
                    trackedData?.totalInActiveSeconds)) *
                  100
              ) + "%",
            idle: `0%`,
            // idle: Math.floor(trackedData?.totalInActiveSeconds / (trackedData?.totalActiveSeconds + trackedData?.totalInActiveSeconds) * 100 ) + "%",
            idleHrs: "",
            // idleHrs: convertToTime(trackedData?.totalInActiveSeconds),
          };

          trackedData?.hours?.forEach((hours: any) => {
            let idleTime: number = 0;
            hours?.minutes?.forEach((minutes: any) => {
              projectTemp.name = minutes?.data?.project[0]?.name;
              projectTemp.id = minutes?.data?.project[0]?.id;
              projectTemp.image = minutes?.data?.project[0]?.image;
              idleTime += minutes?.data?.idleTime;
            });
            projectTemp.idleHrs = convertToTime(idleTime);
            totalIdleTime += idleTime;
          });

          dateData.projects.push(projectTemp);

          totalSecondsLogged += trackedData?.totalSecondsLogged;
          totalInActiveSeconds += trackedData?.totalInActiveSeconds;
          totalActiveSeconds += trackedData?.totalActiveSeconds;
        });
        userData.totalProjects = dateData?.projects?.length;
        userData?.dates?.push(dateData);
      });

      userData.totalTime = convertToTime(totalSecondsLogged);

      userData.totalActivity =
        Math.floor(
          (totalActiveSeconds / (totalActiveSeconds + totalInActiveSeconds)) *
            100
        ) + "%";

      userData.totalIdle = `0%`;

      userData.totalIdleHrs = convertToTime(totalIdleTime);
      //   userData.totalIdle = Math.floor(totalInActiveSeconds / (totalActiveSeconds + totalInActiveSeconds) * 100 ) + "%";

      //   userData.totalIdleHrs = convertToTime(totalInActiveSeconds)

      output.push(userData);
    });

    return output;
  }

  //   function useGroupByMemberData(dataset: any): UserData[] {
  //     const output: UserData[] = [];
  //     var totalSecondsLogged: number = 0;
  //     var totalInActiveSeconds: number = 0;
  //     var totalActiveSeconds: number = 0;

  //     dataset?.data?.forEach((user: any) => {
  //       const userOutput: UserData = {
  //         id: output?.length + 1,
  //         name: user?.entity?.name,
  //         image: user?.entity?.profileImg,
  //         showDetails: false,
  //         totalTime: "",
  //         totalActivity: "",
  //         totalIdle: "",
  //         totalIdleHrs: "",
  //         totalProjects: user?.entity?.projects?.length,
  //         dates: []
  //       };

  //       user.activity.forEach((activity: any) => {
  //         const dateOutput: DateData = {
  //           id: userOutput?.dates?.length + 1,
  //           date: new Date(activity.trackingDate).toDateString(),
  //           projects: []
  //         };

  //         activity?.projects?.trackedData?.forEach((trackedData: any) => {
  //           const projectOutput: ProjectData = {
  //             id: dateOutput?.projects?.length + 1,
  //             image: trackedData?.user === user?.entity._id ? user?.entity?.profileImg : "",
  //             name: trackedData?.hours[0]?.minutes[0]?.data?.project[0]?.name,
  //             time: "",
  //             activity: "",
  //             idle: "",
  //             idleHrs: ""
  //           };

  //           let totalActiveSecondsProject = 0;
  //           let totalInActiveSecondsProject = 0;

  //           trackedData?.hours.forEach((hour: any) => {
  //             hour?.minutes.forEach((minute: any) => {
  //               const activeTimeCount = minute?.data?.activeTimeCount || 0;
  //               const inActiveTimeCount = minute?.data?.inActiveTimeCount || 0;

  //               totalActiveSecondsProject += activeTimeCount;
  //               totalInActiveSecondsProject += inActiveTimeCount;
  //             });
  //           });

  //           projectOutput.activity = Math.floor(totalActiveSecondsProject / (totalActiveSecondsProject + totalInActiveSecondsProject) * 100 ) + "%"

  //           projectOutput.idle = Math.floor(totalInActiveSecondsProject / (totalInActiveSecondsProject + totalActiveSecondsProject) * 100 ) + "%" ;

  //           projectOutput.idleHrs = convertToTime(totalInActiveSecondsProject)
  //           projectOutput.time = convertToTime(totalInActiveSecondsProject + totalActiveSecondsProject)

  //           totalSecondsLogged += trackedData?.totalSecondsLogged
  //           totalInActiveSeconds += trackedData?.totalInActiveSeconds
  //           totalActiveSeconds += trackedData?.totalActiveSeconds

  //           dateOutput.projects.push(projectOutput);
  //         });

  //         userOutput.totalTime = convertToTime(totalSecondsLogged)

  //         userOutput.totalActivity = Math.floor(totalActiveSeconds / (totalActiveSeconds + totalInActiveSeconds) * 100 ) + "%"

  //         userOutput.totalIdle = Math.floor(totalInActiveSeconds / (totalActiveSeconds + totalInActiveSeconds) * 100 ) + "%";

  //         userOutput.totalIdleHrs = convertToTime(totalInActiveSeconds)

  //         userOutput.dates.push(dateOutput);
  //       });

  //       output.push(userOutput);
  //     });

  //     return output;
  //   }

  function convertToTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${hours}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    return formattedTime;
  }

  // Helper function to calculate percentage
  function calculatePercentage(value: number, total: number): string {
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(2)}%`;
  }

  /*****************************   End of table section   ************************************************** */

  /**************************  Section for Time and Activity Table Group by Date  ********************************** */

  const [
    getGroupByDate,
    { loading: groupByDateLoading, data: groupByDateDataFetch },
  ] = useLazyQuery(GET_GROUPBY_DATE);

  const groupByDatePayload = {
    getGroupByDate,
    groupByDateLoading,
    groupByDateDataFetch,
    userId: _id,
    userRole: role,
  };

  interface GroupByDateUser {
    // id: number;
    image: string;
    name: string;
    time: string;
    activity: string;
    idle: string;
    idleHrs: string;
  }

  interface GroupByDateProject {
    // id: number;
    image: string;
    name: string;
    users: GroupByDateUser[];
  }

  interface OutputData {
    id: number;
    showDetails: boolean;
    date: string;
    totalTime: string;
    totalProjects: string;
    totalUsers: string | number;
    totalActivity: string;
    totalIdle: string;
    totalIdleHrs: string;
    projects: GroupByDateProject[];
  }

  function useGroupByDate(inputData: any[]): OutputData[] {
    const output: OutputData[] = [];
    let totalIdleTime: number = 0;

    inputData?.forEach((entry, index) => {
      const date = new Date(entry.entity).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      let totalSecondsLogged = 0;
      let totalActiveSeconds = 0;
      let totalInactiveSeconds = 0;

      const tempEntity: any = {};
      entry?.entitySubGroup?.forEach((users: any) => {
        if (!(users?.name in tempEntity)) {
          users?.trackedData?.forEach((time: any) => {
            totalSecondsLogged += time?.totalSecondsLogged;
            totalActiveSeconds += time?.totalActiveSeconds;
            totalInactiveSeconds += time?.totalInActiveSeconds;
          });
          tempEntity[
            users?.name
              ? users?.name
              : users?.firstName
              ? `${users?.firstName} ${users?.lastName}`
              : "Field Empty"
          ] = users?.name;
        }
        return users?.trackedData?.length;
      });

      const totalSeconds = totalSecondsLogged;
      const totalActivity =
        ((totalActiveSeconds / totalSeconds) * 100).toFixed(0) + "%";
      const totalIdle =
        ((totalInactiveSeconds / totalSeconds) * 100).toFixed(0) + "%";
      const totalIdleHrs = secondsToHms(totalInactiveSeconds);

      const projectTemp: any = {}; //Created this to hold all iterated values and remove any duplicate entries for project
      const userTemp: any = {};
      const projects: GroupByDateProject[] = entry?.entitySubGroup?.map(
        (subGroup: any, projectIndex: any) => {
          const users: GroupByDateUser[] = subGroup?.trackedData?.map(
            (userEntry: any) => {
              let user = {
                // id: userEntry?.user._id,
                image: userEntry?.user?.profileImg,
                name: userEntry?.user?.name
                  ? userEntry?.user?.name
                  : userEntry?.user?.firstName
                  ? `${userEntry?.user?.firstName} ${userEntry?.user?.lastName}`
                  : "Field Empty",
                time: "",
                activity: "",
                idle: "",
                idleHrs: "",
              };
              const activeSeconds = userEntry?.totalActiveSeconds;
              const idleSeconds = userEntry?.totalInActiveSeconds;
              const totalTimeSeconds = activeSeconds + idleSeconds;

              if (!(userEntry?.user?.name in userTemp)) {
                userTemp[
                  userEntry?.user?.name
                    ? userEntry?.user?.name
                    : userEntry?.user?.firstName
                    ? `${userEntry?.user?.firstName} ${userEntry?.user?.lastName}`
                    : "Field Empty"
                ] = userEntry?.user?.name;
                userEntry?.hours?.forEach((hours: any) => {
                  let idleTime: number = 0;
                  hours?.minutes?.forEach((minutes: any) => {
                    idleTime += minutes?.data?.idleTime;
                  });
                  user.idle = `0%`;
                  user.idleHrs = secondsToHms(idleTime);
                  totalIdleTime += idleTime;
                });
              }

              user.activity =
                ((activeSeconds / totalTimeSeconds) * 100).toFixed(0) + "%";
              user.image = userEntry?.user?.profileImg;
              user.name = userEntry?.user?.name
                ? userEntry?.user?.name
                : userEntry?.user?.firstName
                ? `${userEntry?.user?.firstName} ${userEntry?.user?.lastName}`
                : "Field Empty";
              user.time = secondsToHms(totalTimeSeconds);

              return user;
            }
          );

          if (!(subGroup?.name in projectTemp)) {
            projectTemp[
              subGroup?.name
                ? subGroup?.name
                : subGroup?.firstName
                ? `${subGroup?.firstName} ${subGroup?.lastName}`
                : "Field Empty"
            ] = {
              // id: projectIndex + 1,
              image: "",
              name: subGroup?.name,
              users: users,
            };
          }
        }
      );

      output.push({
        id: index + 1,
        showDetails: false,
        date: date,
        totalTime: secondsToHms(totalSecondsLogged),
        totalProjects:
          Object.values(projectTemp).length < 10
            ? "0" + Object.values(projectTemp).length.toString()
            : Object.values(projectTemp).length.toString(),
        totalUsers:
          Object.values(userTemp).length < 10
            ? "0" + Object.values(userTemp).length
            : Object.values(userTemp).length,
        totalActivity: totalActivity,
        totalIdle: `0%`,
        totalIdleHrs: secondsToHms(totalIdleTime),
        projects: Object.values(projectTemp),
      });
    });

    return output;
  }

  function secondsToHms(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  }

  /*****************************   End of table group by date section   ************************************************** */

  /**************************** Section for grouping by project  ************************************ */

  const [
    getGroupByProject,
    { loading: groupByProjectLoading, data: groupByProjectDataFetch },
  ] = useLazyQuery(GET_GROUPBY_PROJECT);

  const groupByProjectPayload = {
    getGroupByProject,
    groupByProjectLoading,
    groupByProjectDataFetch,
    userId: _id,
    userRole: role,
  };

  interface ProjectUserData {
    _id: string;
    email: string;
    title: string;
    firstName: string;
    lastName: string;
    profileImg: string;
  }

  interface TrackedData {
    trackingDate: string;
    totalSecondsLogged: number;
    totalActiveSeconds: number;
    totalInActiveSeconds: number;
    user: ProjectUserData;
    hours: {
      hour: number;
      minutes: {
        minute: number;
        data: {
          activeTimeCount: number;
          inActiveTimeCount: number;
          idleTime: number;
        };
      }[];
    }[];
  }

  interface FormattedUser {
    id: string;
    image: string;
    name: string;
    time: string;
    activity: string;
    idle: string;
    idleHrs: string;
  }

  interface FormattedProject {
    id: number;
    date: string;
    users: FormattedUser[];
  }

  function useGroupByProject(dataset: any) {
    const seenProjectsMap: any = {};

    dataset?.map((group: any, index: any) => {
      let totalUsersPerProject = 0;
      let totalIdleTimeXProjects: number = 0;
      const formattedProjects: FormattedProject[] = group?.entitySubGroup?.map(
        (subGroup: any) => {
          const formattedUsers: FormattedUser[] = subGroup?.trackedData?.map(
            (data: any) => {
              const activePercentage = (
                (data?.totalActiveSeconds / data?.totalSecondsLogged) *
                100
              ).toFixed(2);
              let user = {
                id: data?.user?._id,
                image: data?.user?.profileImg,
                name: `${data?.user?.firstName} ${data?.user?.lastName}`,
                time: formatTime(data?.totalSecondsLogged),
                activity: `${activePercentage}%`,
                idle: `0%`,
                idleHrs: "",
              };
              data?.hours?.forEach((hours: any) => {
                let idleTime: number = 0;
                hours?.minutes?.forEach((minutes: any) => {
                  idleTime += minutes?.data?.idleTime;
                });
                user.idleHrs = formatTime(idleTime);
                totalIdleTimeXProjects += idleTime;
              });

              return user;
            }
          );

          totalUsersPerProject = formattedUsers.length;
          return {
            id: index + 1,
            date: formatDate(subGroup?.trackedData[0]?.trackingDate),
            users: formattedUsers,
          };
        }
      );

      const totalTimeLogged = group?.entitySubGroup?.reduce(
        (total: any, subGroup: any) =>
          total +
          subGroup?.trackedData?.reduce(
            (subTotal: any, data: any) => subTotal + data?.totalSecondsLogged,
            0
          ),
        0
      );

      const totalActiveTime = group?.entitySubGroup?.reduce(
        (total: any, subGroup: any) =>
          total +
          subGroup?.trackedData?.reduce(
            (subTotal: any, data: any) => subTotal + data?.totalActiveSeconds,
            0
          ),
        0
      );

      //   const totalIdleTime = group?.entitySubGroup?.reduce((total: any, subGroup: any) =>
      //     total + subGroup?.trackedData?.reduce((subTotal: any, data:any) => subTotal + data?.totalInActiveSeconds, 0), 0);

      const activePercentage = (
        (totalActiveTime / totalTimeLogged) *
        100
      ).toFixed(2);
      //   const idlePercentage = ((totalIdleTime / totalTimeLogged) * 100).toFixed(2);

      if (!(group?.entity?.name in seenProjectsMap)) {
        seenProjectsMap[
          group?.entity?.name
            ? group?.entity.name
            : group?.entity?.firstName
            ? `${group?.entity?.firstName} ${group?.entity?.lastName}`
            : "Field Empty"
        ] = {
          id: index + 1,
          name: group?.entity?.name,
          image: "",
          showDetails: false,
          totalTime: formatTime(totalTimeLogged),
          totalActivity: `${activePercentage}%`,
          totalIdle: `0%`,
          totalIdleHrs: formatTime(totalIdleTimeXProjects),
          totalMembers: totalUsersPerProject,
          projects: formattedProjects,
        };
      }
    });

    return Object.values(seenProjectsMap).length > 0
      ? Object.values(seenProjectsMap)
      : [
          {
            id: 0,
            name: "",
            image: "",
            showDetails: false,
            totalTime: "",
            totalActivity: "",
            totalIdle: "",
            totalIdleHrs: "",
            totalMembers: "",
            projects: [
              {
                id: "",
                date: "",
                users: [
                  {
                    id: "",
                    image: "",
                    name: "",
                    time: "",
                    activity: "",
                    idle: "",
                    idleHrs: "",
                  },
                ],
              },
            ],
          },
        ];
  }

  function formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toDateString();
  }

  /****************************** End **************************************** */

  return useMemo(
    () => ({
      loading,
      isAuth,
      userData,
      data,
      error,
      chartReportData,
      useGroupByMemberData,
      groupByMemberPayload,
      useGroupByDate,
      groupByDatePayload,
      useGroupByProject,
      groupByProjectPayload,
    }),
    [
      loading,
      isAuth,
      userData,
      data,
      error,
      chartReportData,
      useGroupByMemberData,
      groupByMemberPayload,
      useGroupByDate,
      groupByDatePayload,
      useGroupByProject,
      groupByProjectPayload,
    ]
  );
};

export default useReportTimeAndActivityPageGraphql;
