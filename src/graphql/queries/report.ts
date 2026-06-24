import { gql } from "@apollo/client";

export const GET_TIME_AND_ACTIVITY_REPORT = gql`
  query GetReportingAnalytics($input: getDashboardAnalytics) {
    getReportingAnalytics(input: $input) {
      statusCode
      success
      message
      data {
        weeklyActivity
        workedThisWeek
        idleThisWeek
        totalHoursPerDay
      }
    }
  }
`;

export const GET_TIME_AND_ACTIVITY_GROUPBY = gql`
  query GetGroupedDataTimeAndActivity($input: getGroupedDataTimeAndAnalytics) {
    getGroupedDataTimeAndActivity(input: $input) {
      statusCode
      success
      message
      data {
        entity
        #   activity
        entitySubGroup
      }
    }
  }
`;

export const GET_GROUPBY_DATE = gql`
  query GetGroupedDataTimeAndActivity($input: getGroupedDataTimeAndAnalytics) {
    getGroupedDataTimeAndActivity(input: $input) {
      statusCode
      success
      message
      data {
        entity
        #   activity
        entitySubGroup
      }
    }
  }
`;

export const GET_GROUPBY_PROJECT = gql`
  query GetGroupedDataTimeAndActivity($input: getGroupedDataTimeAndAnalytics) {
    getGroupedDataTimeAndActivity(input: $input) {
      statusCode
      success
      message
      data {
        entity
        #   activity
        entitySubGroup
      }
    }
  }
`;

export const GET_SCHEDULED_REPORTS = gql`
  query GetScheduledReports {
    getScheduledReports {
      _id
      name
      emails
      fileType
      frequency
      deliveryTime
      startDate
      endDate
      subject
      message
      status
      createdAt
      lastSentAt
      nextSendAt
      filterBy
      owner {
        _id
      }
    }
  }
`;

export const GET_ALL_REPORTS_ALTERNATIVE = gql`
  query GetAllReports {
    getAllReports {
      _id
      name
      emails
      fileType
      frequency
      deliveryTime
      startDate
      endDate
      subject
      message
      status
      createdAt
      lastSentAt
      nextSendAt
      filterBy
      owner {
        _id
      }
    }
  }
`;
