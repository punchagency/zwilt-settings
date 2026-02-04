import { gql } from "@apollo/react-hooks";

export const GetOrganizationMembers = gql`
  query GetOrganizationMembers {
    getOrganizationMembers {
      success
      data {
        _id
        user {
          _id
          name
          profile_img
        }
      }
    }
  }
`;

export const GET_INVITED_USERS = gql`
  query GetInvitedUsers {
    getInvitedUsers {
      success
      data {
        _id
        user {
          email
          name
          profile_img
          createdAt
        }
        role
        clientAccountType
        profileStatus
      }
    }
  }
`;
