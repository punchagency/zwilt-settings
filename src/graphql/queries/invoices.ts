import { gql } from "@apollo/client";

export const get_invoices = gql`
  query GetOrganizationInvoices(
    $page: Float
    $limit: Float
    $dateFrom: String
    $dateTo: String
  ) {
    getOrganizationInvoices(
      page: $page
      limit: $limit
      dateFrom: $dateFrom
      dateTo: $dateTo
    ) {
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
