import { gql } from "@apollo/client";

export const GET_CARDS = gql`
  query GetClientPaymentMethods {
    getClientPaymentMethods {
      success
      message
      data {
        paymentMethods {
          id
          billing_details {
            name
          }
          card {
            brand
            last4
            exp_month
            exp_year
          }
          created
        }
        defaultPaymentMethod
      }
    }
  }
`;
