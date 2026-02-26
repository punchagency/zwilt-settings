import { useEffect, useState, useMemo } from "react";
import { useRecoilValue } from "recoil";
import teamAtom from "@/atoms/team-atom";
import useTeamGraphql from "./use-team-graphql";

export interface ILocationOption {
  id?: number;
  label: string;
  value: string;
  count?: number;
}
const useLocationOptions = () => {
  const teamsState = useRecoilValue(teamAtom);
  const teams = teamsState.teams || [];
  const { runGetTeamsQuery } = useTeamGraphql();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teams.length === 0) {
      setLoading(true);
      runGetTeamsQuery({ variables: { input: {} } }).catch((error) => {
        console.error("Error fetching teams:", error);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [teams.length, runGetTeamsQuery]);

  const locationOptions = useMemo<ILocationOption[]>(() => {
    const options: ILocationOption[] = [
      { id: 0, label: "All Team", value: "" }
    ];

    if (teams.length > 0) {
      teams.forEach((team: any, index: number) => {
        if (team?.location) {
          options.push({
            id: index + 1,
            label: team.name || team.location,
            value: team.location.toLowerCase().trim(),
          });
        }
      });
    }

    return options;
  }, [teams]);

  return {
    locationOptions,
    loading,
    teams,
  };
};

export default useLocationOptions;
