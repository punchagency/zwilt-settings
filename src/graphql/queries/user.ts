import { gql } from "@apollo/client";

export const TempGetUser = gql`
  query GetUser {
    getUser {
      success
      data {
        client {
          _id
          user {
            _id
            punchId
            email
            name
            firstName
            lastName
            phone
            profile_img
            isTwoFactorEnabled
            isAuthenticatorEnabled
            isPhoneTwoFactorEnabled
            signedInDevices {
              browser
              device
              location
              signInDate
              sessionToken
            }
          }
          organization {
            _id
            name
            industry
            description
            logo
            companyWebsite
            introVideo
            socialMedia {
              socialLink
              socialType
            }
          }
          role
          clientAccountType
        }
      }
    }
  }
`;
export const GET_USERS = gql`
  query GetUsers($input: usersFilterInput) {
    getUsers(input: $input) {
      statusCode
      success
      message
      data {
        _id
        title
        name
        firstName
        lastName
        email
        profileImg
        inviteToken
        allowTimeTrackingOnAllUserProjects
        role
        projects {
          _id
          projectName
        }
        acceptedInvite
        createdAt
        status
        location
        isBilledSeat
      }
    }
  }
`;
export const GET_PROJECTS = gql`
  query GetProjects {
    getProjects {
      data {
        _id
        projectName
        projectImage
        status
        members {
          _id
          name
          email
          profileImg
          inviteToken
          passwordResetToken
          allowTimeTrackingOnAllUserProjects
          role
          projects {
            _id
          }
          acceptedInvite
          createdAt
          status
        }
        managers {
          _id
          name
          email
          profileImg
          inviteToken
          passwordResetToken
          allowTimeTrackingOnAllUserProjects
          role
          projects {
            _id
          }
          acceptedInvite
          createdAt
        }
      }
    }
  }
`;

export const GET_PROJECTS_DATA = gql`
  query GetProjects($input: projectsFilterInput) {
    getProjects(input: $input) {
      data {
        _id
        projectName
        projectImage
        status
      }
    }
  }
`;
