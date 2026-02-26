import React from "react";
import { styled } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import palettes from "@/constants/palettes";
import arrowImage from "@/assets/icons/dropdown-arrow.svg";

type ButtonProps = {
  title: string;
  variant?: "primary" | "gray" | "disabled";
  onClick?: (e: any) => void;
  loading?: boolean;
  error?: string;
  containerStyles?: React.CSSProperties;
};

type TButtonVariant = {
  primary: string;
  gray: string;
  disabled: string;
};

const buttonBackgroundVariant: TButtonVariant = {
  primary: palettes?.blue[0],
  gray: palettes?.gray[0],
  disabled: palettes?.gray[1],
};

const buttonColorVariant: TButtonVariant = {
  primary: palettes?.light[0],
  gray: palettes?.dark[0],
  disabled: palettes?.dark[0],
};

const Button = ({
  title,
  variant,
  onClick,
  loading,
  error,
  containerStyles,
}: ButtonProps) => {
  const disabled = variant === "disabled" || loading;
  return (
    <ButtonContainer
      onClick={disabled ? () => null : onClick}
      style={{
        background: buttonBackgroundVariant[variant as keyof TButtonVariant],
        color: buttonColorVariant[variant as keyof TButtonVariant],
        cursor: disabled ? "not-allowed" : "pointer",
        ...containerStyles,
      }}
    >
      {loading ? <CircularProgress size="1.5rem" /> : title}
    </ButtonContainer>
  );
};

export default Button;

const ButtonContainer = styled("div")(({ theme }) => ({
  padding: "0.5rem 0.938rem",
  width: "max-content",
  borderRadius: "8px",
  fontSize: "0.875rem",
  cursor: "pointer",
  color: palettes?.dark[0],
  border: `1px solid ${palettes?.gray[0]}`,
}));
