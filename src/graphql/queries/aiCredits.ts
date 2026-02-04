import gql from "graphql-tag";

export const GetAIUsageDashboard = gql`
  query GetAIUsageDashboard($organizationId: String!) {
    getAIUsageDashboard(organizationId: $organizationId) {
      balance {
        totalCredits
        usedCredits
        availableCredits
        subscriptionTier
      }
      totalUsage
      usageByType {
        type
        count
        credits
      }
      recentUsage {
        _id
        userName
        operationType
        creditsConsumed
        entityId
        entityType
        timestamp
        success
      }
    }
  }
`;

export const GetAIUsageHistory = gql`
  query GetAIUsageHistory(
    $organizationId: String!
    $filters: UsageFilterInput
  ) {
    getAIUsageHistory(organizationId: $organizationId, filters: $filters) {
      usage {
        _id
        userName
        operationType
        creditsConsumed
        entityId
        entityType
        timestamp
        success
      }
      total
      page
      totalPages
    }
  }
`;

export const GetSubscriptionTiers = gql`
  query GetSubscriptionTiers {
    getSubscriptionTiers {
      id
      name
      monthlyCredits
      rolloverPercent
      maxRollover
      canPurchaseCredits
      features
      price
      stripePriceId
      creditPurchaseRate
    }
  }
`;
