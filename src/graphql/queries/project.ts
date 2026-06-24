import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query GetProjects($input: projectsFilterInput) {
    getProjects(input: $input) {
      data {
        _id
        projectName
        projectImage
        status
        members {
          _id
          userId
          name
          email
          firstName
          lastName
          profileImg
        }
        managers {
          _id
          userId
          name
          email
          firstName
          lastName
          profileImg
        }
        qa {
          _id
          userId
          name
          email
          firstName
          lastName
          profileImg
        }
      }
    }
  }
`;

export const GET_ACTIVE_TICKETS = gql`
  query GetActiveTickets {
    getActiveTickets {
      _id
      title
      description
      status
      project
      assignee {
        _id
        name
        email
      }
      assignees {
        _id
        name
        email
      }
      priority
      points
      ticketType
      dueDate
      createdAt
    }
  }
`;
