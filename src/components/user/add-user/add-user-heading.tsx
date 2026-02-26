import React from "react";
import { styled } from "@mui/material";
import palettes from "@/constants/palettes";
import arrowImage from "@/assets/icons/dropdown-arrow.svg";

const AddUserHeading = () => {
  return (
    <ProfileUploadContainer>
      <NavigationContainer>
        <TextOne>User Management</TextOne>
        <img
          src={arrowImage.src}
          style={{
            transform: "rotateZ(-90deg)",
            width: "1.3rem",
            height: "1.3rem",
          }}
        />
        <TextOne style={{ color: palettes?.blue[0] }}>Add New Members</TextOne>
      </NavigationContainer>
      <div>
        <BoldTextOne>Lets Setup Member Details</BoldTextOne>
        <TextOne>
          Efficiently manage and onboard new users to your platform.
        </TextOne>
      </div>
    </ProfileUploadContainer>
  );
};

export default AddUserHeading;

const ProfileUploadContainer = styled("div")(({ theme }) => ({
  fontFamily: "Inter",
  marginBottom: "2.25rem",
  [theme.breakpoints.down("md")]: {
    marginBottom: "1.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    marginBottom: "1rem",
  },
}));

const BoldTextOne = styled("div")(({ theme }) => ({
  fontSize: "1.875rem",
  lineHeight: "38px",
  fontWeight: 600,
  color: palettes?.blue[0],
  [theme.breakpoints.down("md")]: {
    fontSize: "1.5rem",
    lineHeight: "32px",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.25rem",
    lineHeight: "28px",
  },
}));

const TextOne = styled("div")(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 400,
  lineHeight: "24px",
  [theme.breakpoints.down("md")]: {
    fontSize: "0.9rem",
    lineHeight: "22px",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.875rem",
    lineHeight: "20px",
  },
}));

const NavigationContainer = styled("div")(({ theme }) => ({
  display: "flex",
  marginBottom: "1.5rem",
  alignItems: "center",
  gap: "0.5rem",
  flexWrap: "wrap",
  [theme.breakpoints.down("md")]: {
    marginBottom: "1rem",
    gap: "0.4rem",
  },
  [theme.breakpoints.down("sm")]: {
    marginBottom: "0.75rem",
    gap: "0.3rem",
    fontSize: "0.875rem",
  },
  "> img": {
    [theme.breakpoints.down("sm")]: {
      width: "1rem",
      height: "1rem",
    },
  },
}));
