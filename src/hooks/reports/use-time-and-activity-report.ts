import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import useUserPage from "../user/use-user-page";
import { useRecoilState } from "recoil";
import timeAndActivityPageAtom, {
  defaultTimeAndActivityPageState,
} from "@/atoms/time-and-activity-page-atom";

const useTimeAndActivityReport: any = () => {
  const [recoilState, setRecoilState] = useRecoilState(timeAndActivityPageAtom);

  type ITimeAndActivityPageState = typeof recoilState;

  type ITimeAndActivityPageStateKey = keyof ITimeAndActivityPageState;

  type IPartialTimeAndActivityPageState = {
    [Property in ITimeAndActivityPageStateKey]?: ITimeAndActivityPageState[Property];
  };

  const [timeAndActivityPageState, setTimeAndActivityPageState] =
    useState<ITimeAndActivityPageState>(defaultTimeAndActivityPageState);

  const updateTimeAndActivityPage = useCallback(
    (update: IPartialTimeAndActivityPageState) => {
      setRecoilState((prevState) => ({
        ...prevState,
        ...update,
      }));
    },
    [recoilState, setRecoilState]
  );

  useEffect(() => {
    setTimeAndActivityPageState(recoilState);
  }, [recoilState, setRecoilState]);

  const getTimeAndActivityPageState = useCallback(() => {
    return timeAndActivityPageState;
  }, [timeAndActivityPageState, recoilState]);

  const getDateRange: any = useCallback(() => {
    return recoilState.dateRange;
  }, [timeAndActivityPageState, recoilState]);

  return useMemo(
    () => ({
      updateTimeAndActivityPage,
      timeAndActivityPageState,
      getTimeAndActivityPageState,
      getDateRange,
    }),
    [
      updateTimeAndActivityPage,
      timeAndActivityPageState,
      getTimeAndActivityPageState,
      getDateRange,
    ]
  );
};

export default useTimeAndActivityReport;
