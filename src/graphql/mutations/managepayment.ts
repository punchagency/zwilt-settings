import { gql } from "@apollo/client";

export const CREATE_SETUP_INTENT = gql`
  mutation CreateOrganizationSetupIntent {
    createOrganizationSetupIntent {
      success
      message
      data {
        clientSecret
      }
    }
  }
`;

export const SET_DEFAULT_CARD = gql`
  mutation SetOrganizationDefaultPaymentMethod($cardId: String!) {
    setOrganizationDefaultPaymentMethod(paymentMethodId: $cardId) {
      success
      message
      data
    }
  }
`;

export const REMOVE_PAYMENT_METHOD = gql`
  mutation RemoveOrganizationPaymentMethod($paymentMethodId: String!) {
    removeOrganizationPaymentMethod(paymentMethodId: $paymentMethodId) {
      success
      message
      data
    }
  }
`;
