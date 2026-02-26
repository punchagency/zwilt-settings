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
`;
export const LOGOUT_USER = gql`
  mutation logout {
    logout {
      success
      statusCode
      message
    }
  }
`;

export const ADD_PROJECT_MEMBER = gql`
  mutation AddNewProjects($input: addNewProjectsInput) {
    addNewProjects(input: $input)
  }
`;
export const INVITE_USER = gql`
  mutation InviteUser($input: InviteUserInput!) {
    inviteUsers(input: $input)
  }
`;

export const EDIT_USER = gql`
  mutation EditUser($input: EditUserInput) {
    editUser(input: $input)
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: String) {
    deleteUser(userId: $userId)
  }
`;

export const DELETE_MULTIPLE_USERS = gql`
  mutation DeleteManyUsers($args: DeleteManyUsersArgs) {
    deleteManyUsers(args: $args)
  }
`;

export const UPDATE_USER = gql`
  mutation EditUser($input: EditUserInput) {
    editUser(input: $input)
  }
`;

export const UPDATE_MULTIPLE_USERS = gql`
  mutation UpdateUserStatus($args: StatusUpdateManyUsersArgs) {
    updateUserStatus(args: $args)
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: changePasswordInput) {
    changePassword(input: $input)
  }
`;
