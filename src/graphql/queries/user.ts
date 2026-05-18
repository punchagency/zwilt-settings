import { gql } from "@apollo/client";

export const TempGetUser = gql`
  query GetUser {
    getUser {
      success
      data {
        client {
          _id
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
        talent {
          _id
        }
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
          accountType
          isClient
          isTalentProfile
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
        name
        firstName
        lastName
        email
        profileImg
        systemRole
        organizationRole
        status
        createdAt
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
          firstName
          lastName
          status
        }
        managers {
          _id
          name
          email
          profileImg
          firstName
          lastName
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
