import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import {
  GetAIUsageDashboard,
  GetAIUsageHistory,
} from "@/graphql/queries/aiCredits";
import useUser from "utils/recoil_store/hooks/use-user-state";
import AIUsageStats from "@/components/ai-credits/AIUsageStats";
import AIUsageChart from "@/components/ai-credits/AIUsageChart";
import AIUsageHistoryTable from "@/components/ai-credits/AIUsageHistoryTable";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Stack,
  Divider,
  Typography,
  styled,
  Skeleton,
} from "@mui/material";
import { calculatePxToPercentage } from "@/../utils/cssHelper";

// Enum values from backend
const AIOperationTypes = [
  "INTERVIEW_GENERATION",
  "QUESTION_GENERATION",
  "CANDIDATE_SUMMARY",
  "JOB_GENERATION",
  "TRANSCRIPT_ANALYSIS",
  "TEXT_TO_SPEECH",
  "CATEGORY_SUGGESTIONS",
  "EMAIL_GENERATION",
  "SMS_GENERATION",
];

const AICreditsPage = () => {
  const { getUserState } = useUser();
  const userState = getUserState();
  const org = userState?.currentUser?.organization;
  // @ts-ignore
  const organizationId = typeof org === "string" ? org : org?._id;

  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<string>("");
  const limit = 20;

  // Dashboard Data (Stats & Chart)
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
  } = useQuery(GetAIUsageDashboard, {
    variables: { organizationId },
    skip: !organizationId,
    fetchPolicy: "network-only",
    context: { clientName: "aiCredits" },
  });

  // History Data (Table)
  const { data: historyData, loading: historyLoading } = useQuery(
    GetAIUsageHistory,
    {
      variables: {
        organizationId,
        filters: {
          page,
          limit,
          operationType: filterType || null,
        },
      },
      skip: !organizationId,
      fetchPolicy: "network-only",
      context: { clientName: "aiCredits" },
    },
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (!organizationId) {
    return (
      <Wrapper>
        <Body className="flex items-center justify-center">
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </Body>
      </Wrapper>
    );
  }

  if (dashboardError) {
    return (
      <Wrapper>
        <div className="p-8 text-red-600">
          Error loading AI credits data: {dashboardError.message}
        </div>
      </Wrapper>
    );
  }

  const dashboard = dashboardData?.getAIUsageDashboard;
  const history = historyData?.getAIUsageHistory;
  const isLoading = dashboardLoading && !dashboardData;

  return (
    <Wrapper>
      <Head>
        <title>AI Credits & Usage | Zwilt</title>
      </Head>
      <ToastContainer />

      <div className="relative bg-white rounded-lg w-full">
        <div className="w-full z-50 top-[0.83vw] bg-white">
          <Heading>
            <CustomText className="page-title">AI Credits & Usage</CustomText>
            <CustomText className="page-subtext">
              Manage your organization&apos;s AI credit balance and view usage
              analytics.
            </CustomText>
          </Heading>

          <Body className="scrollbar-thin">
            {isLoading ? (
              <Stack spacing={4}>
                <Skeleton
                  variant="rectangular"
                  height={140}
                  className="rounded-xl"
                />
                <Skeleton
                  variant="rectangular"
                  height={300}
                  className="rounded-xl"
                />
              </Stack>
            ) : (
              dashboard && (
                <Stack spacing={4}>
                  <AIUsageStats balance={dashboard.balance} />

                  <Stack spacing={3}>
                    <AIUsageChart usageByType={dashboard.usageByType} />

                    <Stack spacing={2}>
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h2
                          className="text-lg font-semibold text-gray-800"
                          style={{ fontFamily: "Switzer" }}
                        >
                          Usage History
                        </h2>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                          <InputLabel>Filter by Type</InputLabel>
                          <Select
                            value={filterType}
                            label="Filter by Type"
                            onChange={(e) => {
                              setFilterType(e.target.value);
                              setPage(1);
                            }}
                          >
                            <MenuItem value="">
                              <em>All Operations</em>
                            </MenuItem>
                            {AIOperationTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type.replace(/_/g, " ")}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>

                      {history ? (
                        <AIUsageHistoryTable
                          logs={history.usage}
                          totalCount={history.total}
                          page={page}
                          rowsPerPage={limit}
                          onPageChange={handlePageChange}
                        />
                      ) : historyLoading ? (
                        <Stack spacing={1}>
                          {[...Array(5)].map((_, i) => (
                            <Skeleton
                              key={i}
                              variant="rectangular"
                              height={60}
                              className="rounded-lg"
                            />
                          ))}
                        </Stack>
                      ) : null}
                    </Stack>
                  </Stack>
                </Stack>
              )
            )}
          </Body>
        </div>
      </div>
    </Wrapper>
  );
};

export default AICreditsPage;

// Styled Components derived from user/index.tsx pattern

const Wrapper = styled(Stack)(({ theme }) => ({
  height: "100%",
  padding: `${calculatePxToPercentage(24)} 0`,
  overflowY: "hidden",
  width: "100%",
}));

const Heading = styled(Stack)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: calculatePxToPercentage(10),
  padding: `0 ${calculatePxToPercentage(24)}`,
  width: "100%",
  borderBottom: "0.0521vw",
}));

const Body = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  background: "white",
  padding: `0 ${calculatePxToPercentage(30)}`,
  height: "70vh",
  overflowY: "scroll",
  overflowX: "hidden",
  paddingTop: calculatePxToPercentage(20),
  paddingBottom: calculatePxToPercentage(50),
}));

const SectionDivider = styled(Divider)(({ theme }) => ({
  marginTop: calculatePxToPercentage(20),
  marginBottom: calculatePxToPercentage(29),
  height: "0.0521vw",
}));

const CustomText = styled(Typography)(({ theme }) => ({
  fontFamily: "Switzer",

  "&.page-title": {
    fontWeight: 600,
    fontSize: calculatePxToPercentage(24),
    lineHeight: calculatePxToPercentage(32.1),
    color: "#282833",
  },

  "&.page-subtext": {
    fontWeight: 400,
    fontSize: calculatePxToPercentage(16),
    lineHeight: calculatePxToPercentage(20.8),
    color: "#6F6F76",
  },
}));
