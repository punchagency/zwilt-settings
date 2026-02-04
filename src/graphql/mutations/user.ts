import { gql } from "@apollo/client";

export const UpdateUserProfile = gql`
  mutation UpdateUserProfile($input: UserProfileInput) {
    updateUserProfile(input: $input) {
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

export const DeleteMyAccount = gql`
  mutation DeleteMyAccount($password: String) {
  deleteMyAccount(password: $password)
}
`
export const LOGOUT_USER = gql`
  mutation logout {
    logout {
      success
      statusCode
      message 
    }
  }
`;