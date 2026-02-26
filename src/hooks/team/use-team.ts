import teamAtom, { defaultTeamState, ITeam } from "@/atoms/team-atom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";

const useTeam = () => {
  const [recoilState, setRecoilState] = useRecoilState(teamAtom);
  const [teamState, setTeamState] = useState<typeof defaultTeamState>(defaultTeamState);

  type ITeamState = typeof recoilState;
  type ITeamStateKey = keyof ITeamState;
  type IPartialTeamState = {
    [Property in ITeamStateKey]?: ITeamState[Property];
  };

  const updateTeam = useCallback(
    (update: IPartialTeamState) => {
      setRecoilState((prevState) => ({
        ...prevState,
        ...update,
      }));
    },
    [recoilState, setRecoilState]
  );

  useEffect(() => {
    setTeamState(recoilState);
  }, [recoilState]);

  const getTeamState = useCallback(() => {
    return teamState;
  }, [teamState, setTeamState]);

  const createTeam = useCallback(async (teamData: Omit<ITeam, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // TODO: Add API call to create team
      const newTeam: ITeam = {
        _id: Math.random().toString(),
        ...teamData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      updateTeam({
        teams: [...(recoilState.teams || []), newTeam],
      });

      return { success: true, team: newTeam };
    } catch (error) {
      console.error('Error creating team:', error);
      return { success: false, error };
    }
  }, [recoilState.teams, updateTeam]);

  const deleteTeam = useCallback(async (teamId: string) => {
    try {
      // TODO: Add API call to delete team
      updateTeam({
        teams: recoilState.teams.filter(team => team._id !== teamId),
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting team:', error);
      return { success: false, error };
    }
  }, [recoilState.teams, updateTeam]);

  const updateTeamDetails = useCallback(async (teamId: string, teamData: Partial<ITeam>) => {
    try {
      // TODO: Add API call to update team
      updateTeam({
        teams: recoilState.teams.map(team => 
          team._id === teamId 
            ? { ...team, ...teamData, updatedAt: new Date().toISOString() }
            : team
        ),
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating team:', error);
      return { success: false, error };
    }
  }, [recoilState.teams, updateTeam]);

  return useMemo(
    () => ({
      updateTeam,
      getTeamState,
      createTeam,
      deleteTeam,
      updateTeamDetails,
    }),
    [updateTeam, getTeamState, createTeam, deleteTeam, updateTeamDetails]
  );
};

export default useTeam; 