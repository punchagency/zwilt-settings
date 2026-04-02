import React from "react";
import { styled } from "@mui/material";
import palettes from "@/constants/palettes";
import ProfileFileUpload from "@/components/common/profile-file-upload/ProfileFileUpload";
import profileIcon from "@/assets/icons/profile.svg";
import { useRouter } from "next/router";

type TAddUserUpload = {
  onFileChange: (event: any) => Promise<void>;
  profileImage: string;
  name?: string;
  isView?: boolean;
};

const AddUserUpload = ({
  onFileChange,
  profileImage,
  name,
  isView,
}: TAddUserUpload) => {
  const router = useRouter();
  const isEditPage = router.query?.edit === "true";

  return (
    <ProfileUploadContainer>
      <div>
        {profileImage ? (
          <Image src={profileImage} />
        ) : isEditPage ? (
          <ImageContainer>
            <AvatarText>{name?.[0]}</AvatarText>
          </ImageContainer>
        ) : (
          <ProfilePictureContainer>
            <img src={profileIcon.src} />
          </ProfilePictureContainer>
        )}
      </div>
      {!isView && (
        <div>
          <BoldTextOne>Profile Pictures</BoldTextOne>
          <TextOne>
            Only use .jpg, .jpeg, .png, & svg. Maximum file size 2MB.
          </TextOne>
          <TextTwo>Approximate size for image should be 256 x 256</TextTwo>
          <UploadContainer>
            <ProfileFileUpload onFileChange={onFileChange} />
          </UploadContainer>
        </div>
      )}
    </ProfileUploadContainer>
  );
};

export default AddUserUpload;

const ProfileUploadContainer = styled("div")(({ theme }) => ({
  fontFamily: "Inter",
  marginBottom: "2.25rem",
  display: "flex",
  gap: "1.5rem",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    marginBottom: "1.5rem",
    gap: "1rem",
  },
  [theme.breakpoints.down("sm")]: {
    marginBottom: "1rem",
    gap: "0.75rem",
    flexDirection: "column",
    alignItems: "flex-start",
  },
}));

const BoldTextOne = styled("div")(({ theme }) => ({
  fontSize: "1rem",
  lineHeight: "24px",
  fontWeight: 600,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9rem",
    lineHeight: "22px",
  },
}));

const TextOne = styled("div")(({ theme }) => ({
  fontSize: "0.75rem",
  color: "#475467",
  fontWeight: 400,
  lineHeight: "18px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
    lineHeight: "16px",
  },
}));

const TextTwo = styled("div")(({ theme }) => ({
  fontSize: "0.75rem",
  color: "#98A2B3",
  fontWeight: 400,
  lineHeight: "18px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
    lineHeight: "16px",
  },
}));

const UploadContainer = styled("div")(({ theme }) => ({
  width: "max-content",
  marginTop: "0.75rem",
}));

const ProfilePictureContainer = styled("div")(({ theme }) => ({
  width: "8rem",
  height: "8rem",
  borderRadius: "250px",
  background: palettes?.gray[2],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  [theme.breakpoints.down("md")]: {
    width: "6rem",
    height: "6rem",
  },
  [theme.breakpoints.down("sm")]: {
    width: "5rem",
    height: "5rem",
  },
  "> img": {
    [theme.breakpoints.down("md")]: {
      width: "60%",
      height: "60%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "50%",
      height: "50%",
    },
  },
}));

const AvatarText = styled("div")(({ theme }) => ({
  fontSize: "2rem",
  color: "#000",
  fontWeight: 400,
  [theme.breakpoints.down("md")]: {
    fontSize: "1.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.25rem",
  },
}));

const ImageContainer = styled("div")(({ theme }) => ({
  width: "8rem",
  height: "8rem",
  borderRadius: "1000px",
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background:
    "radial-gradient(50% 50.00% at 50% 50.00%, #E6E1DE 0%, #D6CECC 100%)",
  flexShrink: 0,
  [theme.breakpoints.down("md")]: {
    width: "6rem",
    height: "6rem",
  },
  [theme.breakpoints.down("sm")]: {
    width: "5rem",
    height: "5rem",
  },
}));

const Image = styled("img")(({ theme }) => ({
  width: "8rem",
  height: "8rem",
  borderRadius: "1000px",
  margin: "auto",
  objectFit: "cover",
  flexShrink: 0,
  [theme.breakpoints.down("md")]: {
    width: "6rem",
    height: "6rem",
  },
  [theme.breakpoints.down("sm")]: {
    width: "5rem",
    height: "5rem",
  },
}));
