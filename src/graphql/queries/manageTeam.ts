import { gql } from "@apollo/client";

export const GET_ORGANIZATION_MEMBERS = gql`
  query GetOrganizationMembers {
    getOrganizationMembers {
      success
      data {
        _id
        createdAt
        user {
          _id
          email
          name
          profile_img
          lastActive
        }
        role
        clientAccountType
        profileStatus
        appAccess
        isBilledSeat
        seatStatus
        source
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
        appAccess
        isBilledSeat
        seatStatus
        source
      }
    }
  }
`;

export const GET_ORG_BILLING_PREVIEW = gql`
  query GetOrgBillingPreview {
    getOrgBillingPreview {
      success
      data {
        seats
        pricePerSeat
        total
        currency
        services {
          name
          seats
          pricePerSeat
          total
        }
      }
    }
  }
`;
