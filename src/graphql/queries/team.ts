import { gql } from "@apollo/client";

export const GET_TEAMS = gql`
  query GetTeams($input: TeamFilterInput) {
    getTeams(input: $input) {
      statusCode
      success
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

export const GET_TEAM_BY_ID = gql`
  query GetTeamById($teamId: ID!) {
    getTeamById(teamId: $teamId) {
      statusCode
      success
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

export const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers($teamId: ID!) {
    getTeamMembers(teamId: $teamId) {
      statusCode
      success
      message
      data {
        _id
        name
        email
        profileImg
        role
      }
    }
  }
`;

export const GET_TEAM_PROJECTS = gql`
  query GetTeamProjects($teamId: ID!) {
    getTeamProjects(teamId: $teamId) {
      statusCode
      success
      message
      data {
        _id
        projectName
        projectImage
      }
    }
  }
`; 