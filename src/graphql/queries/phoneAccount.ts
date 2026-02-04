import { gql } from "@apollo/react-hooks";

export const GetAvailableVirtualNumbers = gql`
  query GetAvailableVirtualNumbers($input: getAvailableVirtualNumbersInput) {
    getAvailableVirtualNumbers(input: $input) {
      numbers {
        msisdn
        country
      }
      count
    }
  }
`;

export const GetOrganizationMembers = gql`
  query GetOrganizationMembers {
    getOrganizationMembers {
      success
      data {
        _id
        user {
          _id
          email
          name
          profile_img
        }
        role
        clientAccountType
      }
    }
  }
`;

export const GetAllAssignedPhoneNumbers = gql`
  query Query($organizationId: String) {
    getAllAssignedPhoneNumbers(organizationId: $organizationId)
  }
`;
