import { gql } from "@apollo/client";

export const GET_DAILY_TOTALS = gql`
  query GetReportingTodayAnalytics($input: getDashboardAnalytics) {
    getReportingTodayAnalytics(input: $input) {
      statusCode
      success
      message
      data {
        dataByDate
        projectsWorkedByDate
      }
    }
  }
`;

export const GET_DAILY_TOTALS_GROUPED_DATA = gql`
  query GetDailyTotalGroupedDataTimeAndActivity(
    $input: getGroupedDataTimeAndAnalytics
  ) {
    getDailyTotalGroupedDataTimeAndActivity(input: $input) {
      statusCode
      success
      message
      data {
        entity
        activity
      }
    }
  }
`;

export const GET_ATTENDANCE_REPORT = gql`
  query GetAttendanceReport($input: getGroupedDataTimeAndAnalytics) {
    getAttendanceReport(input: $input) {
      statusCode
      success
      message
      data {
        dataByDate
        totalResult {
          userData {
            _id
            firstName
            lastName
            email
            name
          }
          tracker {
            totalIdleSeconds
            trackingDate
            hours {
              hour
              minutes {
                minute
                data {
                  project {
                    name
                  }
                }
              }
            }
            summaryNotes
            totalActiveSeconds
            totalSecondsLogged
          }
        }
        attendanceData {
          userData {
            _id
            firstName
            lastName
            email
            name
          }
          tracker {
            totalIdleSeconds
            trackingDate
            hours {
              hour
              minutes {
                minute
                data {
                  project {
                    name
                  }
                }
              }
            }
            summaryNotes
            totalActiveSeconds
            totalSecondsLogged
          }
        }
      }
    }
  }
`;

export const GET_USERS_BELOW_WEEKLY_QUOTA = gql`
  query GetUserBelowWeeklyQuota($input: getLowWeeklyQUotaInput) {
    getUserBelowWeeklyQuota(input: $input) {
      userData {
        _id
        firstName
        lastName
        email
        name
      }
      tracker {
        trackingDate
        totalSecondsLogged
        totalActiveSeconds
        totalInActiveSeconds
        requiredSeconds
        trackedDaysCount
        timeLeftSeconds
      }
    }
  }
`;
