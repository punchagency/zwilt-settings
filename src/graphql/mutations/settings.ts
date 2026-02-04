import { gql } from "@apollo/client";

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($currentPassword: String, $newPassword: String) {
    updatePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      success
      data {
        _id
        name
      }
    }
  }
`;

export const ADD_PHONE = gql`
  mutation AddPersonalPhoneNumber(
    $verificationType: VerificationType
    $phone: String
  ) {
    addPersonalPhoneNumber(verificationType: $verificationType, phone: $phone)
  }
`;

export const VERIFY_PHONE = gql`
  mutation VerifyOtp($requestId: String, $code: String) {
    verifyOtp(requestId: $requestId, code: $code)
  }
`;

export const ENABLE_2FA = gql`
  mutation EnableTwoFactor($type: String!) {
    enableTwoFactor(type: $type)
  }
`;

export const DISABLE_2FA = gql`
  mutation DisableTwoFactor($type: String!) {
    disableTwoFactor(type: $type)
  }
`;


export const VERIFY_2FA = gql`
  mutation VerifyTwoFactorCode($userId: String, $token: String) {
    verifyTwoFactorCode(userId: $userId, token: $token)
  }
`;

export const GENERATE_SECRET = gql`
  mutation Mutation {
    generateTwoFactorSecret
  }
`;

export const REMOVE_DEVICE = gql`
  mutation RemoveSignedInDevice($sessionToken: String) {
    removeSignedInDevice(sessionToken: $sessionToken)
  }
`;

export const REMOVE_2FA = gql`
  mutation RemoveTwoFA {
    removeTwoFA
  }
`;
