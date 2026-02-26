import { gql } from "@apollo/react-hooks";

export const GET_USER_ACTIVITY = gql`
  query Data($input: getTrackedDataInput) {
    getTrackedData(input: $input) 
  }
`;

export const GET_USERS_BY_ACCESS = gql`
  query GetUsersByAccess($input: getUsersInput) {
    getUsersByAccess(input: $input) {
      statusCode
      success
      message
      data {
        _id
        name
        email
        title
        firstName
        lastName
        profileImg
        inviteToken
        passwordResetToken
        allowTimeTrackingOnAllUserProjects
        role
        status
        location
        projects {
          _id
        }
        acceptedInvite
        createdAt
        attachedOrganization {
          _id
        }
      }
    }
  }
`;

export const GET_TODAY_SUMMARY = gql`
  query GetTodaySummary($user: String, $trackingDate: String) {
    getTodaySummary(user: $user, trackingDate: $trackingDate) {
      statusCode
      success
      message
      data {
        totalIdleSeconds
        totalSecondsLogged
        totalInActiveSeconds
        totalActiveSeconds
      }
    }
  }
`;

export const GET_DASHBOARD_ACTIVITY = gql`
  query GetDashboardAnalytics($input: getDashboardAnalytics) {
    getDashboardAnalytics(input: $input) {
      statusCode
      success
      message
      data {
        weeklyActivity
        workedThisWeek
        workedToday
        dailyActivity
        manualTimeAddedToday
        inActiveTimeToday
        manualTimeAdded
        inActiveTime
      }
    }
  }
`;

export const GET_DASHBOARD_ACTIVITY_ONLY_ME = gql`
  query GetDashboardAnalyticsOnlyMe($input: getDashboardAnalytics) {
    getDashboardAnalytics(input: $input) {
      statusCode
      success
      message
      data {
        weeklyActivity
        workedThisWeek
        workedToday
        dailyActivity
        manualTimeAddedToday
        inActiveTimeToday
        manualTimeAdded
        inActiveTime
      }
    }
  }
`;

export const GET_DASHBOARD_RECENT_ACTIVITY = gql`
  query GetRecentActivity($input: getDashboardAnalytics) {
    getRecentActivity(input: $input) {
      statusCode
      success
      message
      data {
        recentActivity {
          data {
            screenshots
            activeTimeCount
            inActiveTimeCount
          }
          minute
        }
      }
    }
  }
`;

export const GET_DASHBOARD_TIMESHEET_1 = gql`
  query GetWorkedTrackedProjects($user: String) {
    getWorkedTrackedProjects(user: $user) {
      statusCode
      success
      message
      data {
        trackedProjectWorked {
          date
          project
          duration
          startTime
          stopTime
        }
      }
    }
  }
`;

export const GET_DASHBOARD_TIMESHEET = gql`
  query GetWorkedTrackedProjects($input: getWorkedTrackedProjectInput) {
    getWorkedTrackedProjects(input: $input) {
      statusCode
      success
      message
      data {
        trackedProjectWorked {
          projectId
          project
          date
          duration
          startTime
          stopTime
        }
      }
    }
  }
`;

export const GET_DASHBOARD_USERS_RECENT_ACTIVITY = gql`
  query GetUsersRecentActivities($input: getUsersInput) {
    getUsersRecentActivities(input: $input) {
      statusCode
      success
      message
      data {
        _id
        name
        firstName
        lastName
        profileImg
        recentTracking {
          _id
          trackingDate
          hours {
            hour
            minutes {
              data {
                screenshots
                inActiveTimeCount
                activeTimeCount
                idleTime
                appUsages {
                  app
                  timeSpent
                  timestamp
                }
                urls {
                  url
                  domain
                  timeSpent
                  timestamp
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_USERS_WITH_ACTIVITY = gql`
  query GetUsersRecentActivities($input: getUsersInput) {
    getUsersRecentActivities(input: $input) {
      statusCode
      success
      message
      data {
        _id
        name
        firstName
        lastName
        profileImg
        recentTracking {
          _id
          trackingDate
          totalSecondsLogged
          totalActiveSeconds
          totalInActiveSeconds
          createdAt
          hours {
            hour
            minutes {
              minute
              data {
                inActiveTimeCount
                activeTimeCount
                idleTime
                appUsages {
                  app
                  timeSpent
                  timestamp
                }
                urls {
                  url
                  domain
                  timeSpent
                  timestamp
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GetUserStatsByWeek = gql`
  query GetUserStatsByWeek($selectedDate: String, $userId: String) {
    getUserStatsByWeek(selectedDate: $selectedDate, userId: $userId) {
      totalSecondsLogged
      totalActiveSeconds
      totalIdleSeconds
      endOfWeek
      startOfWeek
      startDate
    }
  }
`;

export const GetUserDailyStatsForWeek = gql`
  query GetUserDailyStatsForWeek($selectedDate: String, $userId: String) {
    getUserDailyStatsForWeek(selectedDate: $selectedDate, userId: $userId) {
      totalSecondsLogged
      totalActiveSeconds
      totalIdleSeconds
      totalBreakSeconds
      manualTimeAdded
      date
    }
  }
`;

export const REVIEW_ACTIVITY_FLAG = gql`
  mutation ReviewActivityFlag($input: reviewActivityInput) {
    reviewActivityFlag(input: $input)
  }
`;

export const GET_HIGH_IMAGE_SIMILARITY = gql`
  query GetHighImageSimilarity($input: getUsersInput) {
    getHighImageSimilarity(input: $input) {
      statusCode
      success
      message
      data {
        _id
        trackingDate
        hour
        minute
        screenshots
        imageSimilarityPercentage
        user {
          _id
          name
        }
      }
    }
  }
`;

export const GET_TIME_ADDITIONS = gql`
  query GetAllTimeAdditionRequest {
    getAllTimeAdditionRequest {
      statusCode
      success
      message
      data {
        _id
        timeApproved
        reasonForTimeRequest
        startTime
        endTime
        createdAt
        user {
          _id
          firstName
          lastName
          name
          profileImg
        }
        project {
          _id
          projectName
        }
        userWhoUpdateTime {
          _id
          firstName
          lastName
          name
        }
        status
      }
    }
  }
`;

export const GET_ALL_NOTES = gql`
  query GetAllNotes($date: String!, $userId: String) {
    getAllNotes(date: $date, userId: $userId) {
      _id
      note
      createdAt
      user {
        firstName
        lastName
      }
    }
  }
`;

export const GET_TRACKER_NOTES = gql`
  query GetTrackerNotes($date: String!, $userId: String) {
    getTrackerNotes(date: $date, userId: $userId) {
      _id
      note
      timestamp
      hour
      minute
      createdAt
      user {
        firstName
        lastName
      }
    }
  }
`;
