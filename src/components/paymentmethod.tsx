import React, { useState, useEffect, useRef } from "react";
import Cards, { Focused } from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import visa from "@/assests/images/VisaLogo.svg";
import mastercard from "@/assests/images/master.svg";
import Discover from "@/assests/images/disc.svg";
import AmericanEx from "@/assests/images/AmericanEx.png";
import Maestro from "@/assests/images/maes.svg";
import defaultImage from "@/assests/images/nologo.png";
import Plus from "@/assests/images/Plus.svg";
import { motion } from "framer-motion";
import { HiEllipsisHorizontal, HiCreditCard } from "react-icons/hi2";
import paypal from "@/assests/images/paypal_inc_logo.svg.png";
import apple from "@/assests/images/apple_inc_logo.svg.png";
import Image, { StaticImageData } from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import XIcon from "./CloseIcon";
import X from "@/assests/images/X.svg";
import "react-tooltip/dist/react-tooltip.css";
import { kMaxLength } from "buffer";
import dots from "@/assests/images/dots.png";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_SETUP_INTENT,
  SET_DEFAULT_CARD,
  REMOVE_PAYMENT_METHOD,
} from "@/graphql/mutations/managepayment";
import { GET_CARDS } from "@/graphql/queries/payment";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/utils/stripe";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

interface Card {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
  url: StaticImageData;
  name: string;
  created: string;
  showOptions: boolean;
}

interface CardType {
  type: string;
  url: StaticImageData;
}

interface Field {
  name: string;
  type: string;
  placeholder: string;
  span: number;
}

const nameField: Field[] = [
  { name: "name", type: "text", placeholder: "Name", span: 70 },
];

const cardLogos: { [key: string]: StaticImageData } = {
  Visa: visa,
  mastercard: mastercard,
  AmericanEx: AmericanEx,
  Discover: Discover,
  Maestro: Maestro,
  Unknown: defaultImage,
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  number: Yup.string()
    .required("Card number is required")
    .matches(
      /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12}|(?:5[06789]|6)[0-9]{11,18})$/,
      "Card number is not valid"
    ),
  expiry: Yup.string()
    .required("Expiry date is required")
    .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Expiry date is not valid"),
  cvc: Yup.string()
    .min(3, "CVC must be atleast 3 digits")
    .max(4, "CVC must be 3 or 4 digits")
    .required("CVC is required")
    .matches(/^[0-9]{3,4}$/, "CVC is not valid"),
});

// Move notification functions outside components for global use
const notifySuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

const notifyError = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Define the StripeCardForm component outside the PaymentForm component
const StripeCardForm: React.FC<{
  clientSecret: string;
  onSuccess: () => void;
  onCancel: (needsRefresh?: boolean) => void;
}> = ({ clientSecret, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [focused, setFocused] = useState<Focused | undefined>(
    "number" as Focused
  );

  // For Cards visualization
  const [cardDetails, setCardDetails] = useState({
    number: "•••• •••• •••• ••••",
    name: "",
    expiry: "",
    cvc: "",
  });

  // Add a state for card brand
  const [cardBrand, setCardBrand] = useState("");

  // Map Stripe brand names to react-credit-cards-2 supported types
  const mapCardBrand = (stripeBrand: string): string => {
    switch (stripeBrand.toLowerCase()) {
      case "visa":
        return "visa";
      case "mastercard":
        return "mastercard";
      case "amex":
        return "amex";
      case "discover":
        return "discover";
      case "diners":
        return "dinersclub";
      case "jcb":
        return "jcb";
      case "unionpay":
        return "unionpay";
      default:
        return "";
    }
  };

  const handleCardNumberChange = (event: any) => {
    if (event.empty) {
      setCardDetails((prev) => ({
        ...prev,
        number: "•••• •••• •••• ••••",
      }));
    } else if (event.complete) {
      // Show only last 4 digits for security
      const last4 = event.value?.postalCode || event.last4 || "••••";
      setCardDetails((prev) => ({
        ...prev,
        number: `•••• •••• •••• ${last4}`,
      }));
    }

    // Update card brand
    if (event.brand && event.brand !== "unknown") {
      setCardBrand(mapCardBrand(event.brand));
      setFocused("number" as Focused);
    }

    // Clear error when user is typing
    if (error) {
      setError("");
    }
  };

  const handleCardExpiryChange = (event: any) => {
    if (event.empty) {
      setCardDetails((prev) => ({
        ...prev,
        expiry: "",
      }));
    } else {
      // Format as MM/YY
      let expValue = "";
      if (event.complete) {
        // When complete, show a placeholder since we can't access actual value
        expValue = event.error ? "" : "MM/YY";
      } else {
        // During typing, show a visual indicator
        expValue = "MM/YY";
      }

      setCardDetails((prev) => ({
        ...prev,
        expiry: expValue,
      }));
    }

    if (event.focused) {
      setFocused("expiry" as Focused);
    }
  };

  const handleCardCvcChange = (event: any) => {
    if (event.empty) {
      setCardDetails((prev) => ({
        ...prev,
        cvc: "",
      }));
    } else {
      setCardDetails((prev) => ({
        ...prev,
        cvc: event.complete ? "•••" : "•",
      }));
    }

    if (event.focused) {
      setFocused("cvc" as Focused);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      notifyError("Stripe has not been properly initialized");
      setError("Stripe has not been properly initialized");
      return;
    }

    // Get CardElement instance
    const cardElement =
      elements.getElement(CardElement) ||
      elements.getElement(CardNumberElement);

    if (!cardElement) {
      notifyError("Card element not found");
      setError("Card element not found");
      return;
    }

    if (!cardholderName) {
      notifyError("Cardholder name is required");
      setError("Cardholder name is required");
      return;
    }

    if (!clientSecret) {
      notifyError("Invalid setup information. Please try again.");
      setError("Invalid setup information. Please try again.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log(
        "Using client secret:",
        clientSecret.substring(0, 10) + "..."
      );

      const { setupIntent, error } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardholderName,
            },
          },
        }
      );

      if (error) {
        console.error("Setup error:", error);

        // Check for specific "No such setupintent" error
        if (error.message && error.message.includes("No such setupintent")) {
          notifyError(
            "The payment setup session has expired. Please try again with a new session."
          );
          setError(
            "The payment setup session has expired. Please try again with a new session."
          );
          // Signal to parent that we need a new setup intent
          onCancel(true);
        } else {
          notifyError(error.message || "An error occurred");
          setError(error.message || "An error occurred");
        }
        return;
      }

      if (setupIntent && setupIntent.status === "succeeded") {
        onSuccess();
      } else {
        console.error("Setup failed with status:", setupIntent?.status);
        notifyError("Something went wrong. Please try again.");
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Unexpected setup error:", err);
      notifyError("An unexpected error occurred. Please try again.");
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-[500px] min-w-[450px] bg-white p-[1.042vw] rounded-[1.563vw] shadow-[0px 8px 20px rgba(0, 0, 0, 0.2)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-[600] text-[1.25vw]">Card Detail</p>
          </div>

          <div
            onClick={() => onCancel(false)}
            className="cursor-pointer flex items-center justify-center w-[2.083vw] h-[2.083vw] border border-[#E0E0E9] rounded-[0.625vw] hover:bg-[#f4f4fa] hover:border-[#A6A6A6]">
            <Image
              src={X}
              alt="X"
              width={16}
              height={16}
              className="text-[#282833]"
            />
          </div>
        </div>

        {/* Card visualization */}
        <Cards
          number={cardDetails.number}
          name={cardholderName || "YOUR NAME"}
          expiry={cardDetails.expiry || "••/••"}
          cvc={cardDetails.cvc || "•••"}
          focused={focused}
          preview={true}
          issuer={cardBrand}
        />

        <div className="flex gap-5 mt-[1.042vw]">
          <div className="flex-1" style={{ flexBasis: "70%" }}>
            <label
              htmlFor="cardholderName"
              className="block font-medium text-[#282833] mb-2 text-[0.938vw] leading-[1.238vw]">
              Name
            </label>
            <input
              id="cardholderName"
              className="border-[0.052vw] border-[#ccc] p-[0.521vw] w-[100%] rounded-[0.521vw] text-[0.833vw] box-border active:border-[#E0E0E9] focus:outline-none focus:ring-0 placeholder:text-sm"
              type="text"
              placeholder="Name on card"
              value={cardholderName}
              onChange={(e) => {
                setCardholderName(e.target.value);
                setCardDetails((prev) => ({ ...prev, name: e.target.value }));
              }}
              onFocus={() => setFocused("name" as Focused)}
              required
            />
          </div>

          <div className="flex-1" style={{ flexBasis: "30%" }}>
            <label
              htmlFor="card-expiry"
              className="block font-medium text-[#282833] mb-2 text-[0.938vw] leading-[1.238vw]">
              Expiry
            </label>
            <div
              className="border-[0.052vw] border-[#ccc] p-[0.521vw] w-[100%] rounded-[0.521vw] text-[0.833vw] box-border active:border-[#E0E0E9] focus:outline-none focus:ring-0"
              onFocus={() => setFocused("expiry" as Focused)}>
              <CardExpiryElement
                onChange={handleCardExpiryChange}
                onFocus={() => setFocused("expiry" as Focused)}
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                      padding: "10px",
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                  placeholder: "MM/YY",
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-5 mt-[1.042vw]">
          <div className="flex-1" style={{ flexBasis: "70%" }}>
            <label
              htmlFor="card-number"
              className="block font-medium text-[#282833] mb-2 text-[0.938vw] leading-[1.238vw]">
              Card Number
            </label>
            <div
              className="border-[0.052vw] border-[#ccc] p-[0.521vw] w-[100%] rounded-[0.521vw] text-[0.833vw] box-border active:border-[#E0E0E9] focus:outline-none focus:ring-0"
              onFocus={() => setFocused("number" as Focused)}>
              <CardNumberElement
                onChange={handleCardNumberChange}
                onFocus={() => setFocused("number" as Focused)}
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                      padding: "10px",
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                  placeholder: "Card Number",
                }}
              />
            </div>
          </div>

          <div className="flex-1" style={{ flexBasis: "30%" }}>
            <label
              htmlFor="card-cvc"
              className="block font-medium text-[#282833] mb-2 text-[0.938vw] leading-[1.238vw]">
              CVC
            </label>
            <div
              className="border-[0.052vw] border-[#ccc] p-[0.521vw] w-[100%] rounded-[0.521vw] text-[0.833vw] box-border active:border-[#E0E0E9] focus:outline-none focus:ring-0"
              onFocus={() => setFocused("cvc" as Focused)}>
              <CardCvcElement
                onChange={handleCardCvcChange}
                onFocus={() => setFocused("cvc" as Focused)}
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                      padding: "10px",
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                  placeholder: "CVC",
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full items-center gap-4">
          {error && (
            <div className="text-red-500 text-sm mb-2 w-full">{error}</div>
          )}
          <button
            type="button"
            className="bg-white rounded-[0.781vw] font-Switzer text-[0.938vw] font-normal leading-[1.238vw] text-[#282833B2] border border-[#E0E0E9] w-full text-center p-[0.52vw_1.25vw] h-[2.55vw] cursor-pointer hover:bg-[#f4f4fa] hover:border-[#A6A6A6]"
            onClick={() => onCancel(false)}
            disabled={isLoading}>
            Cancel
          </button>

          <button
            type="submit"
            className="bg-[#50589F] hover:bg-[#42498C] text-white rounded-[0.781vw] font-Switzer text-[0.938vw] font-normal leading-[1.238vw] text-center border border-[#E0E0E9] w-full p-[0.52vw_1.25vw] h-[2.55vw] cursor-pointer"
            disabled={!stripe || !elements || isLoading}>
            {isLoading ? (
              <ClipLoader color="#ffffff" size={"1.5vw"} />
            ) : (
              "Save Card"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

const PaymentForm: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [cardToDeleteIndex, setCardToDeleteIndex] = useState<number | null>(
    null
  );

  // Fetch cards from the database
  const {
    data: cardsData,
    loading: cardsLoading,
    error: cardsError,
    refetch,
  } = useQuery(GET_CARDS);

  // Initialize GraphQL mutations
  const [createSetupIntent, { loading: setupIntentLoading }] = useMutation(
    CREATE_SETUP_INTENT,
    {
      onCompleted: (data) => {
        if (data?.createSetupIntent?.success) {
          setClientSecret(data.createSetupIntent.data.clientSecret);
        } else {
          setError(
            data?.createSetupIntent?.message || "Failed to create setup intent"
          );
        }
      },
      onError: (error) => {
        console.error("Error creating setup intent:", error);
        setError("Failed to set up payment method. Please try again.");
      },
    }
  );

  const [setDefaultCard, { loading: defaultCardLoading }] = useMutation(
    SET_DEFAULT_CARD,
    {
      onCompleted: (data) => {
        if (data?.setDefaultCard?.success) {
          refetch();
          notifySuccess("Default payment method updated");
        } else {
          setError(
            data?.setDefaultCard?.message ||
              "Failed to set default payment method"
          );
        }
      },
      onError: (error) => {
        console.error("Error setting default card:", error);
        setError("Failed to update default payment method. Please try again.");
      },
    }
  );

  const [removePaymentMethod, { loading: removePaymentLoading }] = useMutation(
    REMOVE_PAYMENT_METHOD,
    {
      onCompleted: (data) => {
        if (data?.removeClientPaymentMethods?.success) {
          refetch();
          notifySuccess("Payment method removed successfully");
          setShowConfirm(false);
          setCardToDeleteIndex(null);
        } else {
          setError(
            data?.removeClientPaymentMethods?.message ||
              "Failed to remove payment method"
          );
          setShowConfirm(false);
        }
      },
      onError: (error) => {
        console.error("Error removing payment method:", error);
        setError("Failed to remove payment method. Please try again.");
        setShowConfirm(false);
      },
    }
  );

  // Transform data to card format
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (cardsData?.getClientPaymentMethods?.data?.paymentMethods) {
      const { paymentMethods, defaultPaymentMethod } =
        cardsData.getClientPaymentMethods.data;

      const transformedCards = paymentMethods.map((method: any) => {
        // Convert brand to lowercase and get matching image
        const cardType = method.card.brand.toLowerCase();
        let cardTypeForUrl = cardType;

        // Map Stripe's brand names to our image keys
        if (cardType === "visa") cardTypeForUrl = "Visa";
        else if (cardType === "mastercard") cardTypeForUrl = "mastercard";
        else if (cardType === "amex") cardTypeForUrl = "AmericanEx";
        else if (cardType === "discover") cardTypeForUrl = "Discover";

        // Format expiry as MM/YY
        const expiry = `${method.card.exp_month
          .toString()
          .padStart(2, "0")}/${method.card.exp_year.toString().slice(-2)}`;

        return {
          id: method.id,
          type: cardType,
          last4: method.card.last4,
          expiry,
          name: method.billing_details.name || "Card Owner",
          created: method.created,
          isDefault: method.id === defaultPaymentMethod,
          url: cardLogos[cardTypeForUrl] || cardLogos.Unknown,
          showOptions: false,
        };
      });

      setCards(transformedCards);
    }
  }, [cardsData]);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const updatedCards = cards.map((card) => ({
          ...card,
          showOptions: false,
        }));
        setCards(updatedCards);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cards]);

  const handleOpenAddCardForm = () => {
    setIsLoading(true);
    setError("");

    createSetupIntent()
      .then((result) => {
        const clientSecret =
          result?.data?.createSetupIntent?.data?.clientSecret;
        if (clientSecret) {
          console.log("Setup intent created successfully");
          setClientSecret(clientSecret);
          setShowForm(true);
        } else {
          console.error(
            "Failed to create setup intent:",
            result?.data?.createSetupIntent?.message
          );
          notifyError(
            result?.data?.createSetupIntent?.message ||
              "Failed to create setup intent"
          );
          setError(
            result?.data?.createSetupIntent?.message ||
              "Failed to create setup intent"
          );
        }
      })
      .catch((err) => {
        console.error("Error creating setup intent:", err);
        notifyError("Failed to set up payment form. Please try again.");
        setError("Failed to set up payment form. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCardAddSuccess = () => {
    setShowForm(false);
    setClientSecret(null);
    refetch();
    notifySuccess("Card added successfully");
  };

  const handleCancelAddCard = (needsRefresh = false) => {
    setShowForm(false);
    setClientSecret(null);
    setError("");

    // If we need to refresh the setup intent
    if (needsRefresh) {
      // Optional: Show a message
      notifySuccess("Starting a new payment session...");

      // After a short delay, try to create a new setup intent
      setTimeout(() => {
        handleOpenAddCardForm();
      }, 1000);
    }
  };

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );

  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
  };

  const handleOptionClick = (index: number) => {
    const updatedCards = cards.map((card, i) => ({
      ...card,
      showOptions: i === index ? !card.showOptions : false,
    }));
    setCards(updatedCards);
  };

  const handleSetDefault = async (index: number) => {
    const card = cards[index];
    try {
      await setDefaultCard({
        variables: {
          cardId: card.id,
        },
      });
    } catch (error) {
      console.error("Error setting default card:", error);
      notifyError("Failed to set default card. Please try again.");
      setError("Failed to set default card. Please try again.");
    }
  };

  const handleDeleteCard = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedCards = cards.map((card, i) => ({
      ...card,
      showOptions: false,
    }));
    setCards(updatedCards);
    setCardToDeleteIndex(index);
    setShowConfirm(true);
  };

  const confirmDeleteCard = async () => {
    if (cardToDeleteIndex === null) return;

    try {
      const cardToDelete = cards[cardToDeleteIndex];
      await removePaymentMethod({
        variables: {
          paymentMethodId: cardToDelete.id,
        },
      });
    } catch (error) {
      console.error("Error deleting card:", error);
      notifyError("Failed to delete card. Please try again.");
      setError("Failed to delete card. Please try again.");
    }
  };

  const cancelDeleteCard = () => {
    setCardToDeleteIndex(null);
    setShowConfirm(false);
  };

  // Show empty state for both no cards and "User stripe ref not found" error
  const hasStripeRefError =
    cardsError && cardsError.message.includes("User stripe ref not found");
  const shouldShowEmptyState =
    !cardsData?.getClientPaymentMethods?.data?.paymentMethods?.length ||
    hasStripeRefError;

  if (cardsLoading) {
    return (
      <div className="flex items-center justify-center h-[20vh]">
        <ClipLoader color="#282833" size={"5vh"} />
      </div>
    );
  }

  if (cardsError && !hasStripeRefError) {
    return (
      <div className="flex flex-col items-center justify-center h-[20vh]">
        <div className="text-red-500 text-[1vw] mb-[1vw]">
          Error loading cards: {cardsError.message}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#50589F] hover:bg-[#42498C] text-white rounded-[0.781vw] px-[1vw] py-[0.5vw]">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="page-container ">
      <button
        className="flex mt-10 justify-center items-center text-[#282833B2] mr-6 border border-lg cursor-pointer text-base transition-colors duration-300 mb-5 mt-3.75 w-[13.958vw] h-[2.604vw] rounded-[0.781vw] bg-[#FFFFFF] border-[#E0E0E9] ml-auto hover:bg-[#f4f4fa] hover:border-[#A6A6A6] font-[Switzer] font-medium z-50"
        onClick={handleOpenAddCardForm}
        disabled={
          isLoading ||
          setupIntentLoading ||
          defaultCardLoading ||
          removePaymentLoading
        }>
        {setupIntentLoading ? (
          <ClipLoader color="#282833" size={"1.2vw"} />
        ) : (
          <>
            <div className="px-2 -ml-4 "></div>
            <Image
              src={Plus}
              alt="plus"
              width={14}
              height={1}
              className="mr-[0.5vw]"
            />
            <div className="text-[0.833vw]"> Add a New Payment Method </div>
          </>
        )}
      </button>
      <h1
        className="-mt-[3.906vw] px-6  h-[1.354vw]  gap-0 text-[#282833]    font-[Switzer]"
        style={{ fontSize: "1.042vw", fontWeight: "600" }}>
        Card Details
      </h1>

      <p
        className="px-6  h-[1.094vw] gap-0  text-lg font-normal leading-[1.083vw] text-left text-[#6F6F76] font-[Switzer] mt-[0.365vw]"
        style={{
          fontSize: "0.833vw",
          fontWeight: "400",
          fontSizeAdjust: "0.833vw",
        }}>
        Select your default payment method.
      </p>

      {error && <div className="px-6 mt-3 text-red-500 text-sm">{error}</div>}

      <div className="px-6">
        {!shouldShowEmptyState ? (
          <div className="grid gap-4 mt-8 grid-cols-1 sm:grid-cols-2">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`card-item ${card.type} ${
                  selectedCardIndex === index
                    ? " border-[#1a1f71]"
                    : "border-[#E0E0E9]"
                } flex justify-between p-[0.521vw] h-[5.365vw] border  rounded-[0.781vw] bg-white cursor-pointer transition-transform duration-200  w-full relative ${
                  (defaultCardLoading || removePaymentLoading) &&
                  selectedCardIndex === index
                    ? "opacity-70"
                    : ""
                }`}
                onClick={() => handleCardClick(index)}>
                <div className="flex">
                  <Image
                    src={card.url}
                    alt={card.type}
                    className="h-[2.25vw] w-[4.021vw] p-[0.104vw] border rounded-[0.578vw]"
                  />
                  <div className="flex gap-4">
                    <div className="relative flex items-start ml-[1vw] -mt-[0.1vw] flex-col">
                      <div className="relative flex items-center pr-[5vw]">
                        {" "}
                        {/* Increased padding-right */}
                        <p
                          style={{
                            color: "##121212",
                            fontSize: "0.833vw",
                            fontWeight: 500,
                            marginRight: "1rem",
                            whiteSpace: "nowrap",
                          }}>
                          {card.name}
                        </p>
                        {card.isDefault && (
                          <span className="bg-[#F2F4F7] text-[#667085] flex justify-center items-center py-[0.104vw] px-[0.417vw] h-[1.25vw] w-[3.438vw] rounded-[2.604vw] text-[0.625vw] border border-[#D0D5DD] ml-[0.5rem]">
                            Default
                          </span>
                        )}
                      </div>
                      <div>
                        <p
                          style={{
                            color: "#708090",
                            fontWeight: 400,
                            fontSize: "0.833vw",
                          }}>
                          {`${
                            card.type.charAt(0).toUpperCase() +
                            card.type.slice(1)
                          } ending in ${card.last4}`}
                        </p>
                        <p
                          style={{
                            color: "#949494",
                            fontSize: "0.833vw",
                            fontWeight: 400,
                          }}>
                          {`Expiry ${card.expiry}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="">
                  <button
                    className="font-bold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionClick(index);
                    }}>
                    <HiEllipsisHorizontal className="w-[1.25vw] h-[1.25vw] text-[#323232]" />
                  </button>
                  {card.showOptions && (
                    <div
                      className="absolute top-5 right-0 block mt-2 mr-4 h-[6.771vw] w-[7.24vw] rounded-[1.042vw] shadow-lg bg-white text-[#808080] p-[0.521vw] box-border z-10"
                      ref={menuRef}>
                      <button
                        className="w-full p-[0.8vw] flex rounded-xl mt-[0.3vw] hover:bg-gray-100 text-sm whitespace-nowrap"
                        onClick={() => handleSetDefault(index)}
                        disabled={isLoading || defaultCardLoading}>
                        <label className="text-[0.8vw] flex items-center w-full justify-center">
                          {defaultCardLoading && selectedCardIndex === index ? (
                            <ClipLoader color="#282833" size={"0.8vw"} />
                          ) : (
                            "Set as Default"
                          )}
                        </label>
                      </button>

                      <button
                        className="w-full p-[0.8vw] flex rounded-xl text-[0.75vw] hover:bg-gray-100 text-sm"
                        onClick={(event) => handleDeleteCard(index, event)}
                        disabled={isLoading || removePaymentLoading}>
                        <label className="text-[0.8vw]"> Delete </label>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[35vh] mt-8">
            <div className="flex items-center justify-center w-[8vw] h-[8vw] rounded-full bg-[#F4F4FA] mb-[1.5vw]">
              <HiCreditCard className="w-[4vw] h-[4vw] text-[#6F6F76]" />
            </div>
            <h3 className="text-[1.2vw] font-semibold text-[#282833] mb-[0.5vw]">
              {hasStripeRefError
                ? "Payment profile not set up"
                : "No payment methods available"}
            </h3>
            <p className="text-[0.9vw] text-[#6F6F76] max-w-[25vw] text-center mb-[1.5vw]">
              {hasStripeRefError
                ? "Your payment profile needs to be set up. Add a payment method to complete your profile."
                : "Add a payment method to easily manage your subscription payments."}
            </p>
            <button
              className="flex items-center justify-center text-[#FFFFFF] border border-lg cursor-pointer transition-colors duration-300 py-[0.8vw] px-[1.5vw] rounded-[0.781vw] bg-[#50589F] hover:bg-[#42498C] font-[Switzer] font-medium"
              onClick={handleOpenAddCardForm}
              disabled={isLoading || setupIntentLoading}>
              <Image
                src={Plus}
                alt="plus"
                width={14}
                height={1}
                className="mr-[0.5vw] invert"
              />
              <span className="text-[0.833vw]">Add Payment Method</span>
            </button>
          </div>
        )}
      </div>

      {showForm && clientSecret && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
          <Elements stripe={getStripe()} options={{ clientSecret }}>
            <StripeCardForm
              clientSecret={clientSecret}
              onSuccess={handleCardAddSuccess}
              onCancel={handleCancelAddCard}
            />
          </Elements>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 ">
          <div
            className="bg-white p-[2vw] rounded-[1vw] z-10  h-[12vw] w-[22vw]"
            style={{ fontFamily: "Switzer", fontWeight: "500" }}>
            <h1
              className="confirmation text-[1.3vw] font-bold -mt-[0.5vw] font-bold  font-bold text-gray-900 mb-1.5 flex justify-center"
              style={{
                fontWeight: 700,
                color: "#333",
              }}>
              Confirm Deletion
            </h1>
            <p
              className="confirmation-message text-[0.8vw] mt-[0.2vw] font-normal text-gray-800 mb-4"
              style={{
                fontFamily: "Switzer",
                fontWeight: 400,
                color: "#808080",
              }}>
              Are you sure you would like to delete this payment method{" "}
              <span className="flex justify-center">
                {" "}
                from your account? This action cannot be{" "}
              </span>{" "}
              <span className="flex justify-center">
                <b>undone</b>.
              </span>
            </p>
            <div className="confirmation-buttons flex justify-center gap-[1vw] mt-4">
              <button
                className="confirm-button bg-white  text-gray-700 border-2 border-gray-300   rounded-[0.8vw] w-[5vw] h-[2.5vw]  text-[0.8vw]   rounded-[0.8vw]  t transition duration-300  ease-in-out hover:bg-gray-100 hover:border-gray-400 hover:shadow-md"
                onClick={cancelDeleteCard}
                disabled={isLoading || removePaymentLoading}>
                <span className="text-[0.9vw] font-normal">Close</span>
              </button>
              <button
                className="confirm-button bg-red-500 hover:bg-red-600 text-white border-none  w-[5vw] h-[2.5vw]  text-[0.8vw]   rounded-[0.8vw]  transition duration-300 ease-in-out hover:shadow-md font-Switzer font-normal"
                onClick={confirmDeleteCard}
                disabled={isLoading || removePaymentLoading}>
                <span className="text-[0.9vw] font-normal">
                  {removePaymentLoading ? (
                    <ClipLoader color="#ffffff" size={"1.2vw"} />
                  ) : (
                    "Delete"
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
