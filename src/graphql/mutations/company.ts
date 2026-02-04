import { gql } from "@apollo/client";

export const updateCompanyProfile = gql`
  mutation UpdateCompanyProfile($input: CompanyProfileInput) {
    updateCompanyProfile(input: $input) {
      success
      data {
        _id
        name
        industry
        introVideo
        description
        companyWebsite
        logo
        createdAt
        socialMedia {
          socialType
          socialLink
        }
      }
    }
  }
`;
