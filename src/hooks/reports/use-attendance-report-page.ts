import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { useRecoilState } from "recoil";
import AttendancePageAtom, {
  defaultAttendancePageState,
} from "@/atoms/attendance-report-atom";
import { GET_ATTENDANCE_REPORT } from "@/graphql/queries/reports";
import userAtom from "@/atoms/user-atom";

interface IInput {
  input: {
    dateRange?: string[];
    role?: string;
    user?: string;
  };
}

const useAttendanceReport = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [recoilState, setRecoilState] = useRecoilState(AttendancePageAtom);

  type IAttendanReportPageState = typeof recoilState;

  type IAttendanceReportPageStateKey = keyof IAttendanReportPageState;

  type IPartialAttendanceReportPageState = {
    [Property in IAttendanceReportPageStateKey]?: IAttendanReportPageState[Property];
  };

  const [AttendanceReportPageState, setAttendanceReportPageState] =
    useState<IAttendanReportPageState>(defaultAttendancePageState);

  const updateAttendanceReportPage = useCallback(
    (update: IPartialAttendanceReportPageState) => {
      setRecoilState((prev) => ({
        ...prev,
        ...update,
      }));
    },
    [setRecoilState]
  );

  const getAttendancePageState = useCallback(
    (key?: IAttendanceReportPageStateKey) => {
      if (key) {
        return AttendanceReportPageState[key];
      }

      return AttendanceReportPageState;
    },
    [AttendanceReportPageState]
  );

  //   const getAttendanceReport = useCallback(() => {
  //     fetchAttendanceReport({
  //       variables: {
  //         input: {
  //           user: user.userData?._id,
  //           role: user.userData?.role,
  //         },
  //       },
  //     });

  //     if (data) {
  //       setRecoilState((prevState) => ({
  //         ...prevState,
  //         attendanceData: data?.getAttendanceReport?.data,
  //       }));
  //     } else {
  //       setRecoilState((prevState) => ({
  //         ...prevState,
  //         attendanceData: [],
  //       }));
  //     }
  //     console.log("dataa", data?.getAttendanceReport);
  //   }, [data]);

  //   const getFilteredAttendanceReport = useCallback((date: string) => {
  //     fetchAttendanceReport({
  //       variables: {
  //         input: {
  //           user: user.userData?._id,
  //           role: user.userData?.role,
  //           dateRange: date,
  //         },
  //       },
  //     });
  //   }, []);

  useEffect(() => {
    setAttendanceReportPageState(recoilState);
  }, [recoilState]);
  return useMemo(
    () => ({
      AttendanceReportPageState,
      updateAttendanceReportPage,
      getAttendancePageState,
      //   getAttendanceReport,
      //   getFilteredAttendanceReport,
    }),
    [
      AttendanceReportPageState,
      updateAttendanceReportPage,
      getAttendancePageState,
      //   getAttendanceReport,
      //   getFilteredAttendanceReport,
    ]
  );
};
export default useAttendanceReport;
