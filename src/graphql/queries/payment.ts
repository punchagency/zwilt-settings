import { gql } from "@apollo/client";

export const GET_CARDS = gql`
  query GetOrganizationPaymentMethods {
    getOrganizationPaymentMethods {
      success
      message
      data {
        methods {
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
        defaultMethodId
      }
    }
  }
`;
