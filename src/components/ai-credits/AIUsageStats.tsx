import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

interface AIUsageStatsProps {
  balance: {
    totalCredits: number;
    usedCredits: number;
    availableCredits: number;
    subscriptionTier: string;
  };
}

const AIUsageStats: React.FC<AIUsageStatsProps> = ({ balance }) => {
  return (
    <div className="w-full mb-6">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card className="h-full bg-white shadow-sm rounded-xl border border-gray-100">
            <CardContent>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="subtitle2"
                className="uppercase tracking-wider text-xs font-semibold text-gray-500"
              >
                Available Credits
              </Typography>
              <Typography
                variant="h4"
                component="div"
                className="font-bold text-gray-900 mt-2"
              >
                {balance.availableCredits.toLocaleString()}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                className="mt-1 text-sm text-gray-500"
              >
                of {balance.totalCredits.toLocaleString()} Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="h-full bg-white shadow-sm rounded-xl border border-gray-100">
            <CardContent>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="subtitle2"
                className="uppercase tracking-wider text-xs font-semibold text-gray-500"
              >
                Used This Month
              </Typography>
              <Typography
                variant="h4"
                component="div"
                className="font-bold text-indigo-600 mt-2"
              >
                {balance.usedCredits.toLocaleString()}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                className="mt-1 text-sm text-gray-500"
              >
                Credits Consumed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="h-full bg-white shadow-sm rounded-xl border border-gray-100">
            <CardContent>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="subtitle2"
                className="uppercase tracking-wider text-xs font-semibold text-gray-500"
              >
                Current Plan
              </Typography>
              <Typography
                variant="h4"
                component="div"
                className="font-bold text-gray-900 mt-2"
              >
                {balance.subscriptionTier}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                className="mt-1 text-sm text-gray-500"
              >
                Subscription Tier
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AIUsageStats;
