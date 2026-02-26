import React from "react";
import { Typography, LinearProgress, Box, styled } from "@mui/material";

interface UsageByType {
  type: string;
  count: number;
  credits: number;
}

interface AIUsageChartProps {
  usageByType: UsageByType[];
}

const AIUsageChart: React.FC<AIUsageChartProps> = ({ usageByType }) => {
  const sortedUsage = [...usageByType].sort((a, b) => b.credits - a.credits);
  const maxCredits = sortedUsage.length > 0 ? sortedUsage[0].credits : 1;

  return (
    <AnalyticsCard>
      <AnalyticsCardHeader>
        <AnalyticsCardTitle>Usage by Operation</AnalyticsCardTitle>
        <AnalyticsIconWrapper style={{ backgroundColor: "#F3E8FF" }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
              stroke="#9333EA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </AnalyticsIconWrapper>
      </AnalyticsCardHeader>
      <UsageContent>
        {sortedUsage.length === 0 ? (
          <EmptyMessage>No usage data available.</EmptyMessage>
        ) : (
          <UsageList>
            {sortedUsage.map((item) => (
              <UsageItem key={item.type}>
                <UsageItemHeader>
                  <UsageLabel>{item.type.replace(/_/g, " ")}</UsageLabel>
                  <UsageValue>
                    {item.credits} credits ({item.count} calls)
                  </UsageValue>
                </UsageItemHeader>
                <LinearProgress
                  variant="determinate"
                  value={(item.credits / maxCredits) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#f3f4f6",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#4f46e5",
                      borderRadius: 4,
                    },
                  }}
                />
              </UsageItem>
            ))}
          </UsageList>
        )}
      </UsageContent>
    </AnalyticsCard>
  );
};

export default AIUsageChart;

const AnalyticsCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: "8px",
  border: "1px solid #EAECF0",
  padding: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
  [theme.breakpoints.down("md")]: {
    padding: "1.25rem",
  },
}));

const AnalyticsCardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const AnalyticsCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#6B7280",
  lineHeight: "1.25rem",
  [theme.breakpoints.down("md")]: {
    fontSize: "0.8125rem",
  },
}));

const AnalyticsIconWrapper = styled(Box)(({ theme }) => ({
  width: "40px",
  height: "40px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    width: "36px",
    height: "36px",
  },
}));

const UsageContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));

const EmptyMessage = styled(Typography)(({ theme }) => ({
  color: "#6B7280",
  fontSize: "0.875rem",
  textAlign: "center",
  padding: "1rem 0",
}));

const UsageList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
}));

const UsageItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
}));

const UsageItemHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const UsageLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#374151",
  textTransform: "capitalize",
}));

const UsageValue = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: "#6B7280",
}));
