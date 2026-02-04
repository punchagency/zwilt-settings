import { gql } from '@apollo/client';

export const GET_INTERVIEW_SETTINGS = gql`
  query GetInterviewSettings {
    getInterviewSettings {
      statusCode
      success
      message
      data {
        _id
        organization {
          _id
        }
        questionsPerCategory
        questionDelay
        followOnQuestions
        showStatistics
      }
    }
  }
`

export const UPDATE_INTERVIEW_SETTINGS = gql`
  mutation UpdateInterviewSettings($input: UpdateInterviewSettingsInput) {
    updateInterviewSettings(input: $input) {
      statusCode
      success
      message
      data {
        _id
        organization {
          _id
        }
        questionsPerCategory
        questionDelay
        followOnQuestions
        showStatistics
      }
    }
  }
`