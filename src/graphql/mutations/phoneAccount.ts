import { gql } from "@apollo/react-hooks";

export const AssignPhoneNumber = gql`
  mutation AssignPhoneNumber($input: assignPhoneNumberInput) {
    assignPhoneNumber(input: $input)
  }
`;

export const UpdatePhoneAccountRecord = gql`
  mutation UpdatePhoneAccountRecord($input: updatePhoneAccountRecordInput) {
    updatePhoneAccountRecord(input: $input)
  }
`;

export const DeletePhoneRecord = gql`
  mutation DeletePhoneRecord($phoneRecordId: String) {
    deletePhoneRecord(phoneRecordId: $phoneRecordId)
  }
`;
