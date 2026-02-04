import gql from "graphql-tag";

export const UpgradeTier = gql`
  mutation UpgradeTier($input: UpgradeTierInput!) {
    upgradeTier(input: $input) {
      _id
      subscriptionTier
      totalCredits
      availableCredits
    }
  }
`;

export const DowngradeTier = gql`
  mutation DowngradeTier($input: UpgradeTierInput!) {
    downgradeTier(input: $input) {
      _id
      subscriptionTier
      totalCredits
      availableCredits
    }
  }
`;

export const PurchaseAICredits = gql`
  mutation PurchaseAICredits($input: PurchaseCreditsInput!) {
    purchaseAICredits(input: $input) {
      _id
      availableCredits
      purchasedCredits
    }
  }
`;
