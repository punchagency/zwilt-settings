import { Box, Typography, styled } from "@mui/material";
import React from "react";

interface IProjectsTooltip {
  projects: (string | undefined)[];
}

const ProjectsTooltip: React.FC<IProjectsTooltip> = ({ projects }) => {
  return (projects && projects?.length > 0 && (
    <TooltipLayout>
      {projects.map((project, index) => (
        <TooltipText key={index}>{project}</TooltipText>
      ))}
    </TooltipLayout>
  )) as any;
};

export default ProjectsTooltip;

interface ITooltipText {
  disableBottomMargin?: boolean;
}

const TooltipLayout = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#FFFFFF",
  border: "1px solid #F3F4F6",
  borderRadius: "0.75rem",
  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  padding: "0.5rem 0.75rem",
  gap: "0.5rem",
}));

const TooltipText = styled(Typography)<ITooltipText>(
  ({ theme, disableBottomMargin }) => ({
    fontFamily: "Inter",
    color: "#4B5563",
    fontSize: "0.875rem",
    fontWeight: 500,
  }),
);
