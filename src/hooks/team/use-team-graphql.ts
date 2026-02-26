import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { useSetRecoilState } from "recoil";
import {
  CREATE_TEAM,
  UPDATE_TEAM,
  DELETE_TEAM,
  ADD_TEAM_MEMBERS,
  REMOVE_TEAM_MEMBERS,
  ASSIGN_TEAM_PROJECTS,
} from "@/graphql/mutations/team";
import {
  GET_TEAMS,
  GET_TEAM_BY_ID,
  GET_TEAM_MEMBERS,
  GET_TEAM_PROJECTS,
} from "@/graphql/queries/team";
import { ITeam } from "@/atoms/team-atom";
import teamAtom from "@/atoms/team-atom";

const useTeamGraphql = () => {
  const setTeamAtomState = useSetRecoilState(teamAtom);

  const [runGetTeamsQuery] = useLazyQuery(GET_TEAMS, {
    context: { clientName: "tracker" },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.getTeams?.data) {
        setTeamAtomState((prev) => ({ ...prev, teams: data.getTeams.data }));
      }
    },
  });

  const [runGetTeamByIdQuery] = useLazyQuery(GET_TEAM_BY_ID, {
    context: { clientName: "tracker" },
    fetchPolicy: "network-only",
  });

  const [runGetTeamMembersQuery] = useLazyQuery(GET_TEAM_MEMBERS, {
    context: { clientName: "tracker" },
    fetchPolicy: "network-only",
  });

  const [runGetTeamProjectsQuery] = useLazyQuery(GET_TEAM_PROJECTS, {
    context: { clientName: "tracker" },
    fetchPolicy: "network-only",
  });

  const [createTeamMutation] = useMutation(CREATE_TEAM, {
    context: { clientName: "tracker" },
  });
  const [updateTeamMutation] = useMutation(UPDATE_TEAM, {
    context: { clientName: "tracker" },
  });
  const [deleteTeamMutation] = useMutation(DELETE_TEAM, {
    context: { clientName: "tracker" },
  });
  const [addTeamMembersMutation] = useMutation(ADD_TEAM_MEMBERS, {
    context: { clientName: "tracker" },
  });
  const [removeTeamMembersMutation] = useMutation(REMOVE_TEAM_MEMBERS, {
    context: { clientName: "tracker" },
  });
  const [assignTeamProjectsMutation] = useMutation(ASSIGN_TEAM_PROJECTS, {
    context: { clientName: "tracker" },
  });
  const createTeam = async (
    teamData: Omit<ITeam, "_id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      console.log("Sending create team request with data:", teamData);
      const { data } = await createTeamMutation({
        variables: {
          input: teamData,
        },
      });
      console.log("Received create team response:", data);
      if (!data?.createTeam) {
        console.error("No response data from create team mutation");
        return null;
      }
      console.log("Create team mutation successful:", data.createTeam);
      return data.createTeam;
    } catch (error) {
      console.error("Error creating team:", error);
      return null;
    }
  };

  const updateTeam = async (teamId: string, teamData: Partial<ITeam>) => {
    try {
      const { data } = await updateTeamMutation({
        variables: {
          input: {
            teamId,
            ...teamData,
          },
        },
      });
      return data?.updateTeam;
    } catch (error) {
      console.error("Error updating team:", error);
      return null;
    }
  };

  const deleteTeam = async (teamId: string) => {
    try {
      const { data } = await deleteTeamMutation({
        variables: {
          teamId,
        },
      });
      return data?.deleteTeam;
    } catch (error) {
      console.error("Error deleting team:", error);
      return null;
    }
  };

  const addTeamMembers = async (teamId: string, memberIds: string[]) => {
    try {
      const { data } = await addTeamMembersMutation({
        variables: {
          input: {
            teamId,
            memberIds,
          },
        },
      });
      return data?.addTeamMembers;
    } catch (error) {
      console.error("Error adding team members:", error);
      return null;
    }
  };

  const removeTeamMembers = async (teamId: string, memberIds: string[]) => {
    try {
      const { data } = await removeTeamMembersMutation({
        variables: {
          input: {
            teamId,
            memberIds,
          },
        },
      });
      return data?.removeTeamMembers;
    } catch (error) {
      console.error("Error removing team members:", error);
      return null;
    }
  };

  const assignTeamProjects = async (teamId: string, projectIds: string[]) => {
    try {
      const { data } = await assignTeamProjectsMutation({
        variables: {
          input: {
            teamId,
            projectIds,
          },
        },
      });
      return data?.assignTeamProjects;
    } catch (error) {
      console.error("Error assigning team projects:", error);
      return null;
    }
  };

  return {
    runGetTeamsQuery,
    runGetTeamByIdQuery,
    runGetTeamMembersQuery,
    runGetTeamProjectsQuery,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMembers,
    removeTeamMembers,
    assignTeamProjects,
  };
};

export default useTeamGraphql;
