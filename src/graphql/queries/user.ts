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
