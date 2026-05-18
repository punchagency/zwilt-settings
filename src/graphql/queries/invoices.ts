import { gql } from "@apollo/client";

export const get_invoices = gql`
  query GetOrganizationInvoices($page: Float, $limit: Float) {
    getOrganizationInvoices(page: $page, limit: $limit) {
      success
      message
      data {
        invoices {
          _id
          stripeInvoiceId
          amount
          status
          billingDate
          hostedInvoiceUrl
          invoicePdf
          type
          description
        }
        total
        pages
      }
    }
  }
`;
