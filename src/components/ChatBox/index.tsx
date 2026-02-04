import React, { useState } from "react";
import { useRouter } from "next/router";
import { Box, styled } from "@mui/material";
import Badge from "@mui/material/Badge";
import { calculatePxToPercentage } from "./styled";
import ChatIcon from "./Chat";
import ChatNotifyIcon from "./ChatNotifyIcon";

const ChatBox = ({ unreadCount, style }: any) => {
  const router = useRouter();
  const isActive = router?.pathname?.includes("chat");
  const [isHovered, setIsHovered] = useState<any>(false);
  const [isActiv, setIsActive] = useState(false);
  return (
    <ChatBoxWrapper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // @ts-ignore
      hovered={isHovered}
      active={isActive} // Pass the active state here
      sx={{
        cursor: "pointer",
        ...style,
      }}
      onClick={() => {
        setIsActive(true); // Set active to true when clicked
        router.push("/chat", undefined, {
          shallow: true,
        });
      }}
    >
      <StyledBadge badgeContent={unreadCount ?? 0} color='secondary'>
        <IconWrapper>
          <ChatIcon isHovered={isHovered} />
        </IconWrapper>
      </StyledBadge>
    </ChatBoxWrapper>
  );
};

export default ChatBox;

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -0.5,
    top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    backgroundColor: "#FF6C3D",
  },
}));

const ChatBoxWrapper = styled(Box)(({ theme, hovered, active }: any) => ({
  position: "relative",
  padding: calculatePxToPercentage(16),
  cursor: "pointer",
  alignSelf: "center",
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  transition: "all 0.5s ease",
  borderRadius: calculatePxToPercentage(20),
  backgroundColor: active ? "#f4f4fa" : "#FFF", // Conditionally set background color
  zIndex: 1,
  border: active ? "1px solid #B8B8CD" : ".5px solid #E0E0E9", // Conditionally set border color
  "&::after": {
    content: '""',
    position: "absolute",
    width: "10px",
    height: "10px",
    borderRadius: calculatePxToPercentage(20),
    zIndex: -1,
  },
  "&:hover": {
    "&::after": {
      border: "1px solid #b4b4c8",
      opacity: 1,
      backgroundColor: "#F4F4FA",
      width: calculatePxToPercentage(60),
      height: calculatePxToPercentage(60),
    },
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: calculatePxToPercentage(26),
  height: calculatePxToPercentage(26),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));
