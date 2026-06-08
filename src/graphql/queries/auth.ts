import { gql } from "@apollo/client";

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
      success
      statusCode
      message
      data {
        _id
        name
        firstName
        lastName
        email
        profileImg
        punchId
        accountType
        status
        location
        role
        seatStatus
        appAccess
        isBilledSeat
        organizationId
        organizationName
        organizationStatus
        createdAt
        phone
        secondaryEmail
        dob
        gender
        jobTitle
        department
        employeeId
        employmentType
        startDate
        probationPeriod
        address {
          street
          city
          country
          zipCode
        }
        annualLeaveBalance
        availableLeave
      }
    }
  }
`;
