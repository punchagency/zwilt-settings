import { gql } from "@apollo/client";

export const CREATE_TEAM = gql`  mutation CreateTeam($input: CreateTeamInput) {
    createTeam(input: $input) {
      success
      statusCode
      message
      data {
        _id
        name
        location
        description
        members {
          _id
          name
          email
          profileImg
        }
        projects {
          _id
          projectName
          projectImage
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_TEAM = gql`
  mutation UpdateTeam($input: UpdateTeamInput) {
    updateTeam(input: $input) {
      success
      statusCode
      message
      data {
        _id
        name
        location
        description
        members {
          _id
          name
          email
          profileImg
        }
        projects {
          _id
          projectName
          projectImage
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_TEAM = gql`
  mutation DeleteTeam($teamId: ID!) {
    deleteTeam(teamId: $teamId) {
      success
      statusCode
      message
    }
  }
`;

export const ADD_TEAM_MEMBERS = gql`
  mutation AddTeamMembers($input: AddTeamMembersInput) {
    addTeamMembers(input: $input) {
      success
      statusCode
      message
      data {
        _id
        members {
          _id
          name
          email
          profileImg
        }
      }
    }
  }
`;

export const REMOVE_TEAM_MEMBERS = gql`
  mutation RemoveTeamMembers($input: RemoveTeamMembersInput) {
    removeTeamMembers(input: $input) {
      success
      statusCode
      message
      data {
        _id
        members {
          _id
          name
          email
          profileImg
        }
      }
    }
  }
`;

export const ASSIGN_TEAM_PROJECTS = gql`
  mutation AssignTeamProjects($input: AssignTeamProjectsInput) {
    assignTeamProjects(input: $input) {
      success
      statusCode
      message
      data {
        _id
        projects {
          _id
          projectName
          projectImage
        }
      }
    }
  }
`; 