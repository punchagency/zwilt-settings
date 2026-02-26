import React, { useCallback, useEffect, useMemo } from "react";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import useAttendanceReport from "./use-attendance-report-page";
import { useRecoilState } from "recoil";
import userAtom from "@/atoms/user-atom";
import { GET_ATTENDANCE_REPORT } from "@/graphql/queries/reports";

const useAttendanceReportGraphql = () => {
  const [user, setUser] = useRecoilState(userAtom);

  const { updateAttendanceReportPage, AttendanceReportPageState } =
    useAttendanceReport();

  const [
    fetchAttendanceReport,
    { loading: loading, error: error, data: dataR },
  ] = useLazyQuery(GET_ATTENDANCE_REPORT, {
    context: { clientName: "tracker" },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    updateAttendanceReportPage({
      page: 1,
      totalResultCount: dataR?.getAttendanceReport?.data?.totalResult?.length,
      totalResult: dataR?.getAttendanceReport?.data?.totalResult,
      attendance: dataR?.getAttendanceReport?.data?.totalResult,
    });
  }, [dataR]);

  const getAttendanceReport = useCallback((current: string) => {
    fetchAttendanceReport({
      variables: {
        input: {
          organization: user?.userData?.attachedOrganization._id,
          user: user.userData?._id,
          role: user.userData?.role,
          // current: current,
          // limit: "10",
        },
      },
    });
  }, []);

  const getFilteredAttendanceReport = useCallback(
    (date: string[], current: string) => {
      fetchAttendanceReport({
        variables: {
          input: {
            organization: user?.userData?.attachedOrganization._id,
            // current: current,
            // limit: "10",
            user: user.userData?._id,
            role: user.userData?.role,
            dateRange: date,
          },
        },
      });
    },
    [],
  );

  return useMemo(
    () => ({
      getAttendanceReport,
      updateAttendanceReportPage,
      getFilteredAttendanceReport,
    }),
    [
      getAttendanceReport,
      updateAttendanceReportPage,
      getFilteredAttendanceReport,
    ],
  );
};
export default useAttendanceReportGraphql;
