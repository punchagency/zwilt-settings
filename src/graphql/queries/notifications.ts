import { gql } from "@apollo/client";

export const GET_NOTIFICATION_SETTINGS = gql`
  query GetNotificationSettings {
    getNotificationSettings {
      statusCode
      success
      message
      data {
        basic {
          comments
          reactions
          tags
          favourites
        }
        job {
          archived
          posted
        }
        interview {
          complete
          incomplete
        }
        candidate {
          rejected
        }
        teamActivity {
          memberAdded
          memberDeleted
          roleChanged
          addedToTracker
        }
        billingAndPayment {
          paymentMethodChanged
          invoiceGenerated
          paymentSuccessful
          paymentFailed
        }
        userAndAccount {
          loginActivity
          passwordChanged
          profileUpdates
        }
        sales {
          uploadedLeads
          newTrigger
          updatedTrigger
          deletedTrigger
        }
        tracker {
          infraction
          weeklyHours
        }
      }
    }
  }
`;

export const UPDATE_NOTIFICATION_SETTINGS = gql`
  mutation UpdateNotificationSettings($input: UpdateNotificationSettingsInput) {
    updateNotificationSettings(input: $input) {
      statusCode
      success
      message
    }
  }
`;
