import { Box, Typography, styled } from "@mui/material";
import React, { ReactNode } from "react";

interface ITitleBar {
  title: string;
  backgroundImageUrl?: string;
  subtitle?: string;
  rightSideElem?: ReactNode;
  centralizeTitle?: boolean;
  controls?: ReactNode;
}

const TitleBar: React.FC<ITitleBar> = ({
  title,
  subtitle,
  rightSideElem,
  centralizeTitle,
  controls,
  backgroundImageUrl,
}) => {
  return (
    <TitleBarLayout backgroundImageUrl={backgroundImageUrl}>
      <LeftSide centralizeTitle={centralizeTitle}>
        <PageHeaderText>{title}</PageHeaderText>
        {subtitle ? <PageSubTitleText>{subtitle}</PageSubTitleText> : null}
        {controls ? <BottomRow>{controls}</BottomRow> : null}
      </LeftSide>
      {rightSideElem ? <RightSide>{rightSideElem}</RightSide> : null}
    </TitleBarLayout>
  );
};

export default TitleBar;

interface ITitleBarLayout {
  backgroundImageUrl?: string;
}

const TitleBarLayout = styled(Box)<ITitleBarLayout>(
  ({ theme, backgroundImageUrl }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "200px", //theme.customs.spacing.rem(20.0),
    backgroundColor: "#F4F4F4",
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right",
    // border: "1px solid red",
  })
);

interface ILeftSide {
  centralizeTitle?: boolean;
}

const LeftSide = styled(Box)<ILeftSide>(({ theme, centralizeTitle }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: centralizeTitle ? "center" : undefined,
  // alignItems: centralizeTitle ? "center" : undefined,
  marginLeft: centralizeTitle ? theme.customs.spacing.rem(9) : undefined,
  marginRight: centralizeTitle ? theme.customs.spacing.rem(9) : undefined,
  // border: "1px solid red",
}));

const BottomRow = styled(Box)(({ theme }) => ({
  marginTop: theme.customs.spacing.rem(3.2),
  // border: "1px solid red",
}));

const RightSide = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  // border: "1px solid blue"
}));

const PageHeaderText = styled(Typography)(({ theme }) => ({
  fontFamily: "inter",
  fontSize: theme.customs.spacing.rem(3.2),
  lineHeight: theme.customs.spacing.rem(3.8),
  fontWeight: 600,
  color: "#101828",
  marginBottom: theme.customs.spacing.rem(0.8),
  // border: "1px solid green",
}));

const PageSubTitleText = styled(Typography)(({ theme }) => ({
  fontFamily: "inter",
  fontSize: theme.customs.spacing.rem(1.6),
  lineHeight: theme.customs.spacing.rem(2.4),
  fontWeight: 400,
  color: "#7A7F8F",
  // border: "1px solid red",
}));
