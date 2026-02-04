import { gql } from "@apollo/client";

export const ADD_MEMBER_TO_ORGANIZATION = gql`
  mutation AddMemberToOrganization($input: CreateUserInput) {
    addMemberToOrganization(input: $input) {
      success
      data {
        _id
        user {
          email
          name
        }
        role
        clientAccountType
      }
    }
  }
`;

export const UPDATE_MEMBER_PROFILE = gql`
  mutation UpdateMemberProfile($input: UserProfileInput) {
    updateMemberProfile(input: $input) {
      success
      data {
        _id
        user {
          email
          name
          profile_img
          phone
        }
        role
      }
    }
  }
`;

export const DELETE_MEMBER_FROM_ORGANIZATION = gql`
  mutation DeleteMemberFromOrganization($memberId: String) {
    deleteMemberFromOrganization(memberId: $memberId) {
      success
      data {
        _id
        user {
          _id
          name
          email
        }
      }
    }
  }
`;

export const INVITE_USER = gql`
  mutation InviteUser($input: InviteUserInput!) {
    inviteUser(input: $input)
  }

`;

export const CANCEL_INVITATION = gql`
  mutation CancelInvitation($invitationId: String!) {
    cancelInvitation(invitationId: $invitationId)
  }
`;

export const ACCEPT_INVITE = gql`
  mutation AcceptInvite($userId: String) {
    acceptInvite(userId: $userId)
  }
`;
