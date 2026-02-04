import { gql } from "@apollo/client";

export const CREATE_SETUP_INTENT = gql`
  mutation CreateSetupIntent {
    createSetupIntent {
      success
      message
      data {
        clientSecret
      }
    }
  }
`;

export const SET_DEFAULT_CARD = gql`
  mutation SetDefaultCard($cardId: String!) {
    setDefaultCard(cardId: $cardId) {
      success
      message
      data
    }
  }
`;

export const REMOVE_PAYMENT_METHOD = gql`
  mutation RemoveClientPaymentMethods($paymentMethodId: String!) {
    removeClientPaymentMethods(paymentMethodId: $paymentMethodId) {
      success
      message
      data
    }
  }
`;
