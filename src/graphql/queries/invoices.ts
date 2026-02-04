import { gql } from "@apollo/client";

export const get_invoices = gql`
query GetInvoices($clientId: String) {
    getInvoices(clientId: $clientId) {
      data {
        _id
        paymentIntentId
        duration
        amount
        status
        createdAtz
      }
    }
  }`