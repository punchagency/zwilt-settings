import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";

interface UsageByType {
  type: string;
  count: number;
  credits: number;
}

interface AIUsageChartProps {
  usageByType: UsageByType[];
}

const AIUsageChart: React.FC<AIUsageChartProps> = ({ usageByType }) => {
  // Sort by credits descending
  const sortedUsage = [...usageByType].sort((a, b) => b.credits - a.credits);
  const maxCredits = sortedUsage.length > 0 ? sortedUsage[0].credits : 1;

  return (
    <Card className="shadow-sm border border-gray-100 rounded-xl mb-6">
      <CardHeader title="Usage by Operation" />
      <CardContent>
        {sortedUsage.length === 0 ? (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            className="py-4"
          >
            No usage data available.
          </Typography>
        ) : (
          <div className="space-y-4">
            {sortedUsage.map((item) => (
              <div key={item.type}>
                <div className="flex justify-between items-center mb-1">
                  <Typography
                    variant="subtitle2"
                    className="text-sm font-medium text-gray-700"
                  >
                    {item.type.replace(/_/g, " ")}
                  </Typography>
                  <Typography variant="body2" className="text-sm text-gray-600">
                    {item.credits} credits ({item.count} calls)
                  </Typography>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={(item.credits / maxCredits) * 100}
                  className="rounded-full h-2"
                  sx={{
                    backgroundColor: "#f3f4f6",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#4f46e5", // Indigo-600
                      borderRadius: 4,
                    },
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIUsageChart;
