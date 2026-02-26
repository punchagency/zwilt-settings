import React from "react";
import { styled, Box } from "@mui/material";
// import animationData from "@/assets/lottie/Punch_Sign.json";
// import Lottie from "react-lottie";
import { useRecoilState } from "recoil";
import userAtom from "@/atoms/user-atom";
import Image from "next/image";
import { useRouter } from "next/router";
import LogoIcon from "../../assets/icons/logo.svg";
// const defaultOptions = {
//   loop: false,
//   autoplay: true,
//   animationData: animationData,
//   rendererSettings: {
//     preserveAspectRatio: "none",
//   },
// };

const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useRecoilState(userAtom);

  const router = useRouter();
  console.log(user.isAuth, "is auth");
  if (user.isAuth) {
    router.push("/dashboard");
  }
  return (
    <AuthLayoutWrapper>
      <AuthMainBox>
        <AuthChildrenBox>
          <Logo src={LogoIcon} alt="Zwilt" />
          {children}
        </AuthChildrenBox>
        <AuthImageBox>
          <Video
            src={
              "https://res.cloudinary.com/mitchelinaju/video/upload/v1692628295/Render-1_pzbxz5.mp4"
            }
            autoPlay
            muted
            loop
          />
        </AuthImageBox>
      </AuthMainBox>
    </AuthLayoutWrapper>
  );
};

export default AuthLayout;

const AuthLayoutWrapper = styled(Box)(({ theme }) => ({
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "#FFFFFF",
  // paddingBottom: "2.5rem",
  fontFamily: "Inter",
}));

const AuthMainBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
}));

const AuthImageBox = styled(Box)(({ theme }) => ({
  width: "50%",
  height: "100%",
  borderRadius: "2.4rem",
}));

const AuthChildrenBox = styled(Box)(({ theme }) => ({
  width: "50%",
  height: "100%",
  padding: "2.5rem",
}));

const Video = styled("video")(({ theme }) => ({
  position: "relative",
  objectFit: "cover",
  height: "100%",
  width: "100%",
}));
const Logo = styled(Image)``;
