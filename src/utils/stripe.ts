import { loadStripe } from "@stripe/stripe-js";

// Ensure we only create the Stripe instance once
let stripePromise: ReturnType<typeof loadStripe> | null = null;

// Get the publishable key from environment variables
const getPublishableKey = (): string => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!key) {
    console.error("Stripe publishable key is missing");
    return "";
  }

  return key;
};

// Initialize Stripe
export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = getPublishableKey();

    if (!publishableKey) {
      console.error("Failed to initialize Stripe: No publishable key found");
      return null;
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};
