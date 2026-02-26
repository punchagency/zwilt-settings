import { gql } from "@apollo/client";

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: String) {
    getUserById(userId: $userId) {
      success
      statusCode
      message
      data {
        _id
        title
        name
        email
        firstName
        lastName
        profileImg
        inviteToken
        punchId
        passwordResetToken
        allowTimeTrackingOnAllUserProjects
        role
        location
        annualLeaveBalance
        projects {
          _id
          projectName
        }
        acceptedInvite
        createdAt
      }
    }
  }
`;
