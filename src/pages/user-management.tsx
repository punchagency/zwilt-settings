"use client";

import React from "react";
import { Divider, Stack, Typography, styled } from "@mui/material";
import { calculatePxToPercentage } from "@/../utils/cssHelper";
import Users from "@/components/user/UserManagement";

const UserManagementPage: React.FC = () => {
  return (
    <Wrapper>
      <div className="relative bg-white rounded-lg">
        <div className="w-full bg-white">
          <Heading>
            <CustomText className="page-title">User Management</CustomText>
            <CustomText className="page-subtext">
              Manage your workspace users, roles, and access settings.
            </CustomText>
          </Heading>
          <SectionDivider />
          <Body className="scrollbar-thin">
            <Users />
          </Body>
        </div>
      </div>
    </Wrapper>
  );
};

export default UserManagementPage;

const Wrapper = styled(Stack)(() => ({
  height: "100%",
  padding: `${calculatePxToPercentage(24)} 0`,
  overflowY: "hidden",
  width: "100%",
}));

const Heading = styled(Stack)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: calculatePxToPercentage(10),
  padding: `0 ${calculatePxToPercentage(24)}`,
  width: "100%",
  borderBottom: "0.0521vw",
}));

const Body = styled(Stack)(() => ({
  flexDirection: "column",
  background: "white",
  padding: `0 ${calculatePxToPercentage(30)}`,
  height: "70vh",
  overflowY: "scroll",
  overflowX: "hidden",
}));

const SectionDivider = styled(Divider)(() => ({
  marginTop: calculatePxToPercentage(20),
  marginBottom: calculatePxToPercentage(29),
  height: "0.0521vw",
}));

const CustomText = styled(Typography)(() => ({
  fontFamily: "Switzer",

  "&.page-title": {
    fontWeight: 600,
    fontSize: calculatePxToPercentage(24),
    lineHeight: calculatePxToPercentage(32.1),
    color: "#282833",
  },

  "&.page-subtext": {
    fontWeight: 400,
    fontSize: calculatePxToPercentage(16),
    lineHeight: calculatePxToPercentage(20.8),
    color: "#6F6F76",
  },
}));
