import React, { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { CREATE_ACCOUNT } from "@/graphql/mutations/user";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  styled,
  OutlinedInput,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const router = useRouter();
  const { t: token, email } = router.query;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT, {
    onCompleted: (data) => {
      if (data?.createAccount?.success) {
        toast.success("Account created successfully! Redirecting to login...");
        // Redirect to centralized login
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_STORE_APP}/auth/signin?v=account&r=settings`;
        }, 2000);
      } else {
        toast.error(data?.createAccount?.message || "Failed to create account");
      }
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred during signup");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupFormData> = (data) => {
    if (!token) {
      toast.error("Invitation token is missing");
      return;
    }

    createAccount({
      variables: {
        input: {
          name: `${data.firstName} ${data.lastName}`,
          firstName: data.firstName,
          lastName: data.lastName,
          email: (email as string) || "",
          password: data.password,
          token: token as string,
        },
      },
    });
  };

  return (
    <ContainerBox>
      <FormWrapper>
        <Typography variant="h4" fontWeight="600" mb={1}>
          Complete Your Account
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={4}>
          Set your password and identity to join your organization on Zwilt.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" mb={1}>
                First Name*
              </Typography>
              <StyledInput
                {...register("firstName")}
                placeholder="First name"
                fullWidth
                error={!!errors.firstName}
              />
              {errors.firstName && (
                <ErrorMessage>{errors.firstName.message}</ErrorMessage>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" mb={1}>
                Last Name*
              </Typography>
              <StyledInput
                {...register("lastName")}
                placeholder="Last name"
                fullWidth
                error={!!errors.lastName}
              />
              {errors.lastName && (
                <ErrorMessage>{errors.lastName.message}</ErrorMessage>
              )}
            </Box>
          </Box>

          <InputGroup>
            <Typography variant="subtitle2" mb={1}>
              Password*
            </Typography>
            <StyledInput
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              fullWidth
              error={!!errors.password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Typography variant="subtitle2" mb={1}>
              Confirm Password*
            </Typography>
            <StyledInput
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              fullWidth
              error={!!errors.confirmPassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.confirmPassword && (
              <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
            )}
          </InputGroup>

          <SubmitButton
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Complete Registration"
            )}
          </SubmitButton>
        </form>
      </FormWrapper>
    </ContainerBox>
  );
};

// This page does NOT require authentication as it IS the onboarding logic
SignupPage.requireAuth = false;

export default SignupPage;

const ContainerBox = styled(Box)(() => ({
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#F8F9FB",
}));

const FormWrapper = styled(Box)(() => ({
  width: "100%",
  maxWidth: "450px",
  padding: "40px",
  background: "#FFFFFF",
  borderRadius: "12px",
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
}));

const InputGroup = styled(Box)(() => ({
  marginBottom: "20px",
}));

const StyledInput = styled(OutlinedInput)(() => ({
  borderRadius: "8px",
  "& .MuiOutlinedInput-input": {
    padding: "12px 14px",
  },
}));

const ErrorMessage = styled(Typography)(() => ({
  color: "#D32F2F",
  fontSize: "0.75rem",
  marginTop: "4px",
}));

const SubmitButton = styled(Button)(() => ({
  marginTop: "10px",
  padding: "12px",
  borderRadius: "8px",
  background: "#244BB6",
  textTransform: "none",
  fontWeight: "600",
  fontSize: "1rem",
  "&:hover": {
    background: "#1c3a8c",
  },
}));
