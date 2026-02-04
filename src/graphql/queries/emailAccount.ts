import { gql } from "@apollo/client";

export const GetEmailAccounts = gql`
    query GetEmailAccounts {
        getEmailAccounts {
        success
        data {
            _id
            email
            isAssigned
            isConnected
            serviceProvider
            createdAt
            assignedUser {
            _id
            profile_img
            }
        }
        }
    }

`

export const assignEmail = gql`
    query GetEmailAccounts {
        getEmailAccounts {
        success
        data {
            _id
            email
           
        }
    }
}
`