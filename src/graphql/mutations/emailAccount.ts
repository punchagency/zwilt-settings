import { gql } from "@apollo/react-hooks";

export const AddAndConnectEmailAccount = gql`
mutation AddAndConnectEmailAccount($input: EmailAccountInput) {
  addAndConnectEmailAccount(input: $input)
}
`

export const AssignEmailAccount = gql`
mutation AssignEmailAccount($input: EmailUpdateInput) {
    assignEmailAccount(input: $input)
  }

`
export const UnAssignEmailAccount = gql`
mutation UnAssignEmailAccount($input: EmailUpdateInput) {
  unAssignEmailAccount(input: $input)
}
`

export const DeleteEmailAccount = gql`
mutation DeleteEmailAccount($input: EmailUpdateInput) {
  deleteEmailAccount(input: $input)
}
`

export const ConnectAndDisconnectEmail = gql`
mutation ConnectAndDisconnectEmail($email: String, $connect: Boolean) {
  connectAndDisconnectEmail(email: $email, connect: $connect)
}
`
