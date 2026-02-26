import { Box, styled } from "@mui/material";
import React from "react";
import CustomDropdown from "../dropdown/CustomDropdown";
import { IProject } from "./types";

interface IAssignProjectForm {
  projects: IProject[];
  setSelectedProjects: (ids: (string | number)[]) => void;
  selectedProjects: (string | number)[];
}

const AssignProjectForm: React.FC<IAssignProjectForm> = ({
  projects,
  setSelectedProjects,
  selectedProjects,
}) => {
  const filteredProjects = projects
    ?.filter((project: any) => !!project?.name && project?.status === 'ACTIVE')
    .map((project: any) => ({
      id: project.id,
      name: project.name,
      image: project?.image || "",
    }));

  // sort the filteredProjects such that projects in selectedProjects comes first
  const sortedProjects = filteredProjects.sort((a, b) => {
    if (selectedProjects.includes(a.id)) return -1;
    if (selectedProjects.includes(b.id)) return 1;
    return 0;
  });

  return (
    <Wrapper>
      <FormSectionHeader>Link Project</FormSectionHeader>
      {/* <DropdownWrapper> */}
      <CustomDropdown
        data={sortedProjects}
        extra="0"
        listWrapperStyle={{ height: "20rem", maxHeight: "20rem" }}
        extraLabel="Assigned Projects"
        extraX="User can log time against selected projects"
        label="Select Project"
        placeholder="Select Project"
        onChange={(ids) => setSelectedProjects(ids)}
        value={selectedProjects}
      />
      {/* </DropdownWrapper> */}
    </Wrapper>
  );
};

export default AssignProjectForm;

const Wrapper = styled("div")(({ theme }) => ({
  background: "#FFFFFF",
  height: "30rem",
}));

const FormSectionHeader = styled("h3")(({ theme }) => ({
  // marginTop: theme.customs.spacing.rem(2.4),
  fontFamily: "inter",
  marginBottom: theme.customs.spacing.rem(2.4),
  fontWeight: 600,
  lineHeight: theme.customs.spacing.rem(1.6),
  fontSize: theme.customs.spacing.rem(2.4),
}));

const DropdownWrapper = styled(Box)(({ theme }) => ({
  maxHeight: theme.customs.spacing.rem(42),
  // overflow: 'hidden',
  paddingBottom: theme.customs.spacing.rem(6.0),
  // border: "1px solid red",
}));
