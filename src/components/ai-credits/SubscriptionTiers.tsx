import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Stack,
  Chip,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { useMutation, useQuery, gql } from "@apollo/client";
import { toast } from "react-toastify";
import PurchaseCreditsModal from "./PurchaseCreditsModal";

import { UpgradeTier, DowngradeTier } from "@/graphql/mutations/aiCredits";
import {
  GetSubscriptionTiers,
  GetAIUsageDashboard,
} from "@/graphql/queries/aiCredits";

interface TierFeature {
  text: string;
  included: boolean;
}

interface Tier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: "outlined" | "contained";
  isPopular?: boolean;
  creditPurchaseRate: number; // Added
}

interface SubscriptionTiersProps {
  currentTier: string;
  organizationId: string;
}

const SubscriptionTiers: React.FC<SubscriptionTiersProps> = ({
  currentTier,
  organizationId,
}) => {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedPackRate, setSelectedPackRate] = useState(0.5); // Default rate, will update from tier

  const [upgradeTier] = useMutation(UpgradeTier, {
    context: { clientName: "aiCredits" },
    refetchQueries: [
      {
        query: GetAIUsageDashboard,
        variables: { organizationId },
        context: { clientName: "aiCredits" },
      },
    ],
    onCompleted: () => {
      setLoadingTier(null);
      toast.success("Subscription upgraded successfully!");
      // Ideally refetch dashboard
    },
    onError: (error) => {
      setLoadingTier(null);
      toast.error(`Upgrade failed: ${error.message}`);
    },
  });

  const [downgradeTier] = useMutation(DowngradeTier, {
    context: { clientName: "aiCredits" },
    refetchQueries: [
      {
        query: GetAIUsageDashboard,
        variables: { organizationId },
        context: { clientName: "aiCredits" },
      },
    ],
    onCompleted: () => {
      setLoadingTier(null);
      toast.success("Subscription downgrade scheduled.");
    },
    onError: (error) => {
      setLoadingTier(null);
      toast.error(`Downgrade failed: ${error.message}`);
    },
  });

  const { data: tiersData, loading: tiersLoading } = useQuery(
    GetSubscriptionTiers,
    {
      context: { clientName: "aiCredits" },
      onCompleted: (data) => {
        // Update selected pack rate if current tier is found
        const myTier = data?.getSubscriptionTiers?.find(
          (t: any) => t.id === currentTier,
        );
        if (myTier) {
          setSelectedPackRate(myTier.creditPurchaseRate / 100);
        }
      },
    },
  );

  const handleTierChange = (targetTier: string) => {
    if (loadingTier) return;
    setLoadingTier(targetTier);

    // We need to know the order of tiers to decide if it's upgrade or downgrade
    // Assumed order: REGULAR, PRO, ULTIMATE
    const tierOrder = ["REGULAR", "PRO", "ULTIMATE"];
    const currentIndex = tierOrder.indexOf(currentTier);
    const targetIndex = tierOrder.indexOf(targetTier);

    const input = { organizationId, newTier: targetTier };

    if (targetIndex > currentIndex) {
      upgradeTier({ variables: { input } });
    } else {
      downgradeTier({ variables: { input } });
    }
  };

  const handleOpenPurchaseModal = () => {
    // Find current tier rate
    const myTier = tiersData?.getSubscriptionTiers?.find(
      (t: any) => t.id === currentTier,
    );
    if (myTier) {
      setSelectedPackRate(myTier.creditPurchaseRate / 100);
    }
    setPurchaseModalOpen(true);
  };

  if (tiersLoading) {
    return (
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {[1, 2, 3].map((i) => (
          <Grid item xs={12} md={4} key={i}>
            <Skeleton
              variant="rectangular"
              height={400}
              className="rounded-xl"
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  // Map backend data to UI format
  const tiers: Tier[] =
    tiersData?.getSubscriptionTiers?.map((t: any) => ({
      id: t.id,
      name: t.name,
      price: t.price === 0 ? "Free" : `$${(t.price / 100).toFixed(0)}`,
      period: "/mo",
      description:
        t.id === "REGULAR"
          ? "Essential AI features for small teams"
          : t.id === "PRO"
            ? "Advanced power for growing organizations"
            : "Maximum performance and priority support",
      features: [
        `${t.monthlyCredits} Monthly Credits`,
        `Rollover up to ${t.maxRollover} credits`,
        ...t.features
          .filter((f: string) => f !== "all")
          .map((f: string) => (f === "priority" ? "Priority Processing" : f)),
      ],
      buttonText: t.id === currentTier ? "Current Plan" : "Upgrade", // Logic handled below for Downgrade
      buttonVariant: t.id === "PRO" ? "contained" : "outlined",
      isPopular: t.id === "PRO",
      creditPurchaseRate: t.creditPurchaseRate / 100,
    })) || [];

  // Sort tiers by price to ensure correct order locally if backend order varies
  // Actually simpler to enforce order: Regular, Pro, Ultimate
  const orderedTiers = [
    tiers.find((t) => t.id === "REGULAR"),
    tiers.find((t) => t.id === "PRO"),
    tiers.find((t) => t.id === "ULTIMATE"),
  ].filter(Boolean) as Tier[];

  return (
    <Box sx={{ width: "100%", py: 4 }}>
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {orderedTiers.map((tier) => {
          const isCurrent = tier.id === currentTier;
          const tierOrder = ["REGULAR", "PRO", "ULTIMATE"];
          const currentIndex = tierOrder.indexOf(currentTier);
          const tierIndex = tierOrder.indexOf(tier.id);
          const isUpgrade = tierIndex > currentIndex;
          const isDowngrade = tierIndex < currentIndex;
          const isActionLoading = loadingTier === tier.id;

          return (
            <Grid item xs={12} md={4} key={tier.id}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  position: "relative",
                  borderColor: tier.isPopular ? "#3C448B" : "divider",
                  borderWidth: tier.isPopular ? 2 : 1,
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                {tier.isPopular && (
                  <Chip
                    label="Most Popular"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      bgcolor: "#E0E7FF",
                      color: "#3C448B",
                      fontWeight: 600,
                      fontFamily: "Switzer",
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      fontFamily: "Switzer",
                      fontWeight: 700,
                      color: "#282833",
                      mb: 1,
                    }}
                  >
                    {tier.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: "Switzer", mb: 3, minHeight: 40 }}
                  >
                    {tier.description}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "baseline", mb: 3 }}>
                    <Typography
                      variant="h3"
                      component="span"
                      sx={{
                        fontFamily: "Switzer",
                        fontWeight: 700,
                        color: "#282833",
                      }}
                    >
                      {tier.price}
                    </Typography>
                    {tier.price !== "Free" && (
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{ ml: 1, fontFamily: "Switzer" }}
                      >
                        {tier.period}
                      </Typography>
                    )}
                  </Box>

                  <Stack spacing={2} sx={{ mb: 4 }}>
                    {tier.features.map((feature, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                      >
                        <CheckIcon />
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "Switzer", color: "#4B5563" }}
                        >
                          {feature}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>

                <Box sx={{ p: 3, pt: 0, mt: "auto" }}>
                  {isCurrent ? (
                    <Button
                      fullWidth
                      variant="outlined"
                      disabled
                      sx={{
                        fontFamily: "Switzer",
                        textTransform: "none",
                        borderColor: "#3C448B",
                        color: "#3C448B",
                        bgcolor: "#F3F4F6",
                      }}
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant={isUpgrade ? "contained" : "outlined"}
                      disabled={isActionLoading}
                      onClick={() => handleTierChange(tier.id)}
                      sx={{
                        fontFamily: "Switzer",
                        textTransform: "none",
                        ...(isUpgrade
                          ? {
                              bgcolor: "#3C448B",
                              "&:hover": { bgcolor: "#2c336b" },
                            }
                          : {
                              color: "#3C448B",
                              borderColor: "#3C448B",
                            }),
                      }}
                    >
                      {isActionLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : isUpgrade ? (
                        "Upgrade"
                      ) : (
                        "Downgrade"
                      )}
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 600,
            width: "100%",
            borderRadius: 4,
            bgcolor: "#F8FAFC",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 3,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontFamily: "Switzer", fontWeight: 600 }}
              >
                Need more credits?
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "Switzer" }}
              >
                Purchase additional credit packs. Starting at $
                {selectedPackRate}/credit.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={handleOpenPurchaseModal}
              sx={{
                fontFamily: "Switzer",
                textTransform: "none",
                borderColor: "#3C448B",
                color: "#3C448B",
              }}
            >
              Buy Credits
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Credits Purchase Modal */}
      <PurchaseCreditsModal
        open={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        organizationId={organizationId}
        ratePerCredit={selectedPackRate}
      />
    </Box>
  );
};

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.6666 5L7.49992 14.1667L3.33325 10"
      stroke="#3C448B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SubscriptionTiers;
