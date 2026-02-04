import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { PurchaseAICredits } from "../../graphql/mutations/aiCredits";
import { GetAIUsageDashboard } from "../../graphql/queries/aiCredits";
import { notifySuccessFxn, notifyErrorFxn } from "utils/toast-fxn";

interface PurchaseCreditsModalProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  ratePerCredit?: number; // Price in USD per credit
}

const CREDIT_PACK_AMOUNTS = [100, 500, 1000];

const PurchaseCreditsModal: React.FC<PurchaseCreditsModalProps> = ({
  open,
  onClose,
  organizationId,
  ratePerCredit = 0.5, // Default to 50 cents if not provided
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const [purchaseCredits, { loading }] = useMutation(PurchaseAICredits, {
    context: { clientName: "aiCredits" },
    refetchQueries: [
      {
        query: GetAIUsageDashboard,
        variables: { organizationId },
        context: { clientName: "aiCredits" },
      },
    ],
    onCompleted: (data) => {
      notifySuccessFxn(
        `Successfully purchased ${data.purchaseAICredits.purchasedCredits} credits!`,
      );
      onClose();
      setSelectedAmount(null);
    },
    onError: (error) => {
      notifyErrorFxn(error.message || "Failed to purchase credits");
    },
  });

  const handlePurchase = () => {
    if (!selectedAmount) return;
    purchaseCredits({
      variables: {
        input: {
          organizationId,
          amount: selectedAmount,
        },
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography
          variant="h6"
          sx={{ fontFamily: "Switzer", fontWeight: 600 }}
        >
          Purchase AI Credits
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, fontFamily: "Switzer" }}
        >
          Select a credit pack to top up your balance. Current rate: $
          {ratePerCredit.toFixed(2)} / credit.
        </Typography>

        <Grid container spacing={2}>
          {CREDIT_PACK_AMOUNTS.map((amount) => {
            const price = amount * ratePerCredit;
            return (
              <Grid item xs={12} sm={4} key={amount}>
                <Card
                  sx={{
                    border:
                      selectedAmount === amount
                        ? "2px solid #3C448B"
                        : "1px solid #e0e0e0",
                    bgcolor: selectedAmount === amount ? "#f5f6ff" : "white",
                  }}
                >
                  <CardActionArea onClick={() => setSelectedAmount(amount)}>
                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#3C448B",
                          fontFamily: "Switzer",
                        }}
                      >
                        {amount}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontFamily: "Switzer" }}
                      >
                        Credits
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ mt: 1, fontWeight: 600, fontFamily: "Switzer" }}
                      >
                        ${price.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ color: "#666" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handlePurchase}
          disabled={!selectedAmount || loading}
          sx={{
            bgcolor: "#3C448B",
            "&:hover": { bgcolor: "#2c336b" },
            fontFamily: "Switzer",
            px: 4,
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Purchase"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseCreditsModal;
