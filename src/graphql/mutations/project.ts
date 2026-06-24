import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: createProjectInput) {
    createProject(input: $input) {
      success
      statusCode
      message
      data {
        _id
        projectName
        projectImage
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProjectSettings($input: updateProjectSettingsInput) {
    updateProjectSettings(input: $input)
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($input: deleteProjectInput) {
    deleteProject(input: $input)
  }
`;

export const UPDATE_PROJECT_STATUS = gql`
  mutation UpdateProjectStatus($input: deleteProjectInput) {
    updateProjectStatus(input: $input)
  }
`;
