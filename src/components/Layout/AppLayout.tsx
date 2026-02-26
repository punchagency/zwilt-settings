"use client";
import React from "react";
import { Box, styled } from "@mui/material";
import Header from "@/components/header/Header";
import AppTheme from "@/components/themes/AppTheme";
import { useEffect, useRef, useState, RefObject } from "react";
import userAtom from "@/atoms/user-atom";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import Loader from "../common/Loader/Loader";
import { layoutType } from "@/types/layout";
import { calculatePxToPercentage } from "@/../utils/cssHelper";

interface IAppLayout extends layoutType {
  children: React.ReactNode;
}

const AppLayout = ({ children, layoutType }: IAppLayout) => {
  const [user, setUser] = useRecoilState(userAtom);
  const [showLoader, setShowLoader] = useState(true);

  const router = useRouter();

  const [headerHeight, setHeaderHeight] = useState(100 + "");
  const header = useRef() as RefObject<HTMLDivElement>;
  useEffect(() => {
    if (!user.isAuth) {
    }
    setHeaderHeight(header.current?.style?.height || "0px");
  }, []);

  useEffect(() => {
    setShowLoader(user.loading && !user.isAuth);
  }, [user.loading]);
  return (
    <>
      <PageWrapper show={showLoader}>
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      </PageWrapper>
      <PageWrapper show={!showLoader}>
        <MainContentWrapper>
          <HeaderWrapper id="headerWrapper" ref={header}>
            <Header />
          </HeaderWrapper>

          <ContentWrapper
            layoutType={layoutType}
            style={{
              height: `calc(100vh - ${headerHeight})`,
              overflowY: "auto",
              marginTop: "1rem",
            }}
          >
            {children}
          </ContentWrapper>
        </MainContentWrapper>
      </PageWrapper>
    </>
  );
};

export default AppLayout;

interface IPageWrapper {
  show?: boolean;
}

const PageWrapper = styled(Box)<IPageWrapper>(({ theme, show }) => ({
  height: "100%",
  maxHeight: "100%",
  flex: 1,
  display: show ? "flex" : "none",
  flexDirection: "row",
  overflow: "hidden",
  margin: 0,
  backgroundColor: "#FFF",
  width: "100%",
  minWidth: 0,
}));

const MainContentWrapper = styled(Box)(({}) => ({
  width: "100%",
  height: "100vh",
  backgroundColor: "#F4F4FA",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  overflow: "hidden",
}));

const ContentWrapper = styled(Box)<layoutType>(({ theme, layoutType }) => ({
  flex: "1 1 auto",
  overflow: "auto",
  marginTop: "1rem",
  padding:
    layoutType === "fullWidth"
      ? calculatePxToPercentage(16)
      : `${calculatePxToPercentage(16)} ${calculatePxToPercentage(24)}`,
  backgroundColor: "#ffffff",
  borderRadius: calculatePxToPercentage(18),
  transition: "all 0.2s ease-in-out",
  position: "relative",
  width: "100%",
  minWidth: 0,
  "&::-webkit-scrollbar": {
    width: "8px",
    marginRight: "4px",
  },
  "&::-webkit-scrollbar-track": {
    margin: "4px",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#E0E0E0",
    borderRadius: "4px",
  },
}));

const LoaderWrapper = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100vw",
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  flex: "0 0 auto",
}));
