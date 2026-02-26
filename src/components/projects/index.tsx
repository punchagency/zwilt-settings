import { styled, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import CustomTable from "../Table";
import SearchIcon from "../../assets/img/search-normal.svg";
import AddIcon from "../../assets/img/add.svg";
import PlusIcon from "../../assets/img/plus.svg";
import EditBtnIcon from "../../assets/icons/edit-btn-icon.svg";
import DeleteBtnIcon from "../../assets/icons/delete-btn-icon.svg";
import erx from "src/components/reports/constants/arrow-down.svg";
import ArchiveBtnIcon from "../../assets/icons/archive.svg";
import NewProjectModal from "./NewProjectModal";
import ConfirmNotification from "./ConfirmNotification";
import ExternalActionModal from "./ExternalActionModal";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";

import { GET_PROJECTS } from "@/graphql/queries/project";
import {
  CREATE_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT,
  UPDATE_PROJECT_STATUS,
} from "@/graphql/mutations/project";
import AddMemberModal from "./AddMembers";
import AvatarP from "../avatar";
import Container from "../Layout/Container";
import CustomTitleBar from "../common/TitleBar/CustomTitleBar";
import ControlPanel from "../common/TitleBar/ControlPanel";
import { useRecoilState } from "recoil";
import userAtom from "@/atoms/user-atom";
import managerProjectsAtom, {
  ManagerProject,
} from "@/atoms/manager-projects-atom";
import { GET_PROJECTS_DATA } from "@/graphql/queries/user";
import { notifyErrorFxn } from "@/utils/toast-fxn";

interface ProjectT {
  id: string;
  name: {
    name: string;
    image: string;
  };
  members: Array<any>;
  managers: Array<any>;
  qa: Array<any>;
}

const ProjectsWrapper = styled("div")`
  border-radius: 15px;
  background: #fff;
  // padding: 24px;
  flex: 1;
  border: 1px solid #eaecf0;
  border-radius: 8px;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    margin-top: 1rem;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    margin-top: 0.5rem;
    border-radius: 8px;
  }
`;

const ProjectNameWrapper = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  color: #1d2939;
  font-size: 0.875rem;
  line-height: 1.125rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    gap: 0.4rem;
  }
`;

const ProjectMemberWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
  width: 60%;
  gap: 10px;

  @media (max-width: 1024px) {
    width: 70%;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    gap: 8px;
  }
`;

const ProjectAvatars = styled("div")`
  display: flex;
  width: 70%;
  > div {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 2px solid white;
    position: relative;
  }

  > div:nth-of-type(2),
  div:nth-of-type(3),
  div:nth-of-type(4),
  div:nth-of-type(5) {
    margin-left: -0.6rem;
  }

  @media (max-width: 768px) {
    width: auto;
    > div {
      width: 1.75rem;
      height: 1.75rem;
    }

    > div:nth-of-type(2),
    div:nth-of-type(3),
    div:nth-of-type(4),
    div:nth-of-type(5) {
      margin-left: -0.5rem;
    }
  }
`;

const MembersNumber = styled("span")`
  width: 2rem;
  height: 2rem;
  font-size: 0.7rem;
  position: relative;
  margin-left: -0.6rem;
  color: #7f56d9;
  border: 2px solid white;
  border-radius: 50%;
  line-height: 1.1rem;
  background: #f9f5ff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;

  @media (max-width: 768px) {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.65rem;
    margin-left: -0.5rem;
  }
`;

const AddBtn = styled("button")`
  all: unset;
  border: 0.5px solid #eaecf0;
  border-radius: 8px;
  width: 2rem;
  height: 2rem;
  background: #eaecf0;
  display: flex;
  padding: 0 1.5rem;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  white-space: nowrap;
  > span {
    color: #000000;
    font-size: 0.8rem;
  }

  > img {
    width: 100%;
  }

  @media (max-width: 768px) {
    padding: 0 0.8rem;
    height: 1.75rem;
    min-width: auto;
    > span {
      font-size: 0.7rem;
    }
  }
`;

const ProjectTable = styled("div")`
  flex: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ProjectCardsContainer = styled("div")`
  display: none;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 768px) {
    display: flex;
    padding: 0.75rem;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    gap: 0.5rem;
  }
`;

const ProjectCard = styled("div")`
  background: #fff;
  border: 1px solid #eaecf0;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: box-shadow 0.2s ease;

  &:active {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    border-radius: 8px;
    gap: 0.5rem;
  }
`;

const ProjectCardHeader = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;

  @media (max-width: 480px) {
    gap: 0.3rem;
    flex-wrap: wrap;
  }
`;

const ProjectCardNameSection = styled("div")`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`;

const ProjectCardActions = styled("div")`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 480px) {
    gap: 0.3rem;
  }
`;

const ProjectCardInfo = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProjectCardRow = styled("div")`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #667085;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
`;

const ProjectCardLabel = styled("span")`
  font-weight: 500;
  color: #344054;
  min-width: 60px;

  @media (max-width: 480px) {
    min-width: 50px;
    font-size: 0.8rem;
  }
`;

const ProjectCardValue = styled("span")`
  color: #667085;
`;

const Projects: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));
  
  const [activeTab, setActiveTab] = useState(0);
  const [user] = useRecoilState(userAtom);
  const [managerProjects, setManagerProjects] =useRecoilState(managerProjectsAtom);
  const [dropdownAction, setDropdownAction] = useState("");
  const [actionComplete, setActionComplete] = useState(false);

  const isAuthorizedForActions = (): boolean => {
    const userRole = user?.userData?.role;
    return userRole === "ORGANIZATION_MANAGER" || userRole === "ORGANIZATION_OWNER";
  };

  const handleActionWithAuth = (actionName: string) => {
    if (!isAuthorizedForActions()) {
      notifyErrorFxn("You are not authorized to perform this actions");
      return;
    }
    setDropdownAction(actionName);
  };

  const toggleTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };
  const [searchInput, setSearchInput] = useState("");
  const [tableData, setTableData] = useState([]);
  const [getProjects, { loading, data, refetch }] = useLazyQuery(GET_PROJECTS, {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
    onCompleted: () => {
      console.log("Projects fetched successfully");
    },
  });
  const [
    getProjectsSimple,
    { loading: simpleLoading, data: simpleData, refetch: simpleRefetch },
  ] = useLazyQuery(GET_PROJECTS_DATA, {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const [activeCount, setActiveCount] = useState();
  const [archivedCount, setArchivedCount] = useState();
  const [totalProjectsCount, setTotalProjectsCount] = useState(0);
  const [workingProjectsCount, setWorkingProjectsCount] = useState(0);

  // Keep track of the highest counts we've seen to handle inconsistencies
  const [maxActiveCount, setMaxActiveCount] = useState(0);
  const [maxArchivedCount, setMaxArchivedCount] = useState(0);

  // Function to compute manager projects for current user
  const computeManagerProjects = (projects: any[]) => {
    if (!user?.userData?._id || !projects) return [];

    const managerProjects: ManagerProject[] = projects
      .filter((project: any) => {
        // Check if current user is in the managers array
        return project.managers?.some(
          (manager: any) => manager._id === user.userData._id
        );
      })
      .map((project: any) => ({
        _id: project._id,
        projectName: project.projectName,
        projectImage: project.projectImage,
        status: project.status,
      }));

    return managerProjects;
  };

  const getCreatedAtFromId = (id: string) => {
    if (!id) return null;
    try {
      const timestamp = parseInt(id.substring(0, 8), 16);
      if (Number.isNaN(timestamp)) return null;
      return new Date(timestamp * 1000).toISOString();
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (user?.userData?.attachedOrganization?._id) {
      // Use primary query first
      getProjects({
        variables: {
          input: {
            organization: user?.userData?.attachedOrganization?._id,
          },
        },
      });

      // Backup query using simpler aggregation
      getProjectsSimple({
        variables: {
          input: {
            organization: user?.userData?.attachedOrganization?._id,
          },
        },
      });

      setTimeout(() => {
        console.log(
          "Force refreshing projects data immediately after initial load"
        );
        getProjects({
          variables: {
            input: {
              organization: user?.userData?.attachedOrganization?._id,
            },
          },
        });
      }, 500);
    }
  }, [user]);

  // Force refresh on component mount to ensure fresh data
  useEffect(() => {
    const timer = setTimeout(() => {
      if (data?.getProjects?.data && refetch) {
        console.log("Force refreshing projects data on mount");
        refetch();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, refetch]);
  useEffect(() => {
    if (actionComplete) {
      refetch();
      simpleRefetch();
      setActionComplete(false);
    }
  }, [actionComplete, refetch, simpleRefetch]);

  useEffect(() => {
    if (!data?.getProjects?.data) return;

    const allProjects = data.getProjects.data;

    // Compute and set manager projects
    const managerProjectsForUser = computeManagerProjects(allProjects);
    setManagerProjects(managerProjectsForUser);

    const filteredByRole =
      user?.userData?.role === "PROJECT_MANAGER"
        ? allProjects.filter((project: any) =>
            project?.managers?.some(
              (manager: any) => manager?._id === user?.userData?._id
            )
          )
        : allProjects;

    setTotalProjectsCount(filteredByRole.length || 0);

    // Enhanced filtering with better null checking and fallback logic
    const archived = filteredByRole.filter((project: any) => {
      if (!project?.projectName) {
        return false;
      }

      return (
        project?.status === "ARCHIVED" &&
        project.projectName &&
        project.projectName.toLowerCase().includes(searchInput.toLowerCase())
      );
    }).length;

    const activeC = filteredByRole
      .filter((project: any) => {
        return (
          project?.projectName || (project?._id && project?._id.length > 0)
        );
      })
      .filter((project: any) => {
        return (
          project?.status !== "ARCHIVED" &&
          project?.projectName &&
          project.projectName.toLowerCase().includes(searchInput.toLowerCase())
        );
      }).length;

    if (activeC > maxActiveCount) {
      setMaxActiveCount(activeC);
    }

    if (archived > maxArchivedCount) {
      setMaxArchivedCount(archived);
    }

    setActiveCount(activeC);
    setArchivedCount(archived);

    // Calculate working projects (projects with members/managers assigned)
    const workingC = filteredByRole.filter((project: any) => {
      return (
        project?.status !== "ARCHIVED" &&
        project?.projectName &&
        (project?.members?.length > 0 || project?.managers?.length > 0)
      );
    }).length;
    setWorkingProjectsCount(workingC);

    setTableData(
      filteredByRole
        ?.filter((project: any) => {
          if (!project?.projectName) {
            return false;
          }

          if (activeTab === 1) {
            return (
              project.status === "ARCHIVED" &&
              (project.projectName || "")
                .toLowerCase()
                .includes(searchInput.toLowerCase())
            );
          }
          return (
            project.status !== "ARCHIVED" &&
            (project.projectName || "")
              .toLowerCase()
              .includes(searchInput.toLowerCase())
          );
        })
        ?.map((project: any) => {
          const createdAt = getCreatedAtFromId(project._id);
          return {
            name: { name: project.projectName, image: project.projectImage },
            members: project.members,
            managers: project.managers,
            qa: project.qa,
            createdAt,
            id: project._id,
          };
        })
        .sort((a: any, b: any) => a.name.name.localeCompare(b.name.name))
    );
  }, [
    data,
    activeTab,
    searchInput,
    maxActiveCount,
    maxArchivedCount,
    user?.userData?._id,
    user?.userData?.role,
  ]);

  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectT>();

  useEffect(() => {
    if (dropdownAction === "Edit Project") {
      setAction("edit");
      setOpen(true);
    } else if (dropdownAction === "Delete Project") {
      setAction("delete");
      setConfirmModal(true);
    } else if (dropdownAction === "Archive Project") {
      setAction("archive");
      setConfirmModal(true);
    } else if (dropdownAction === "Unarchive Project") {
      setAction("unarchive");
      setConfirmModal(true);
    }
  }, [dropdownAction]);

  const [
    deleteProject,
    { loading: deleteProjectLoading, error: deleteProjectError },
  ] = useMutation(DELETE_PROJECT);

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<
    "create" | "edit" | "delete" | "archive" | "unarchive"
  >();

  const handleClose = () => {
    setOpen(false);
    setAction(undefined);
    setDropdownAction("");
    setAddMember(false);
    setActionComplete(false);
    setConfirmAction(false);
    setSelectedProject(undefined);
    refetch();
  };

  const handleOpen = () => {
    setSelectedProject(undefined);
    setActionComplete(false);
    setConfirmAction(false);
    setAction("create");
    setOpen(true);
  };

  const closeConfirmModal = () => {
    setAction(undefined);
    setConfirmModal(false);
    setSuccess(undefined);
    setSelectedProject(undefined);
    refetch();
    setDropdownAction("");
    setConfirmAction(false);
  };
  const [success, setSuccess] = useState<"error" | "true" | "loading">();

  const columns = [
    {
      name: (
        <div style={{ display: "flex", alignItems: "center" }}>
          Name
          {/* <Image src={erx.src} width={20} height={20} alt="" /> */}
        </div>
      ),
      id: "name",
      width: 25,
      render: (value: any) => {
        return (
          <ProjectNameWrapper>
            {/* <Image src={ProjectImg} alt="" /> */}
            <AvatarP img={value.image} initial={value.name} />
            {value.name}
          </ProjectNameWrapper>
        );
      },
    },
    {
      name: "Created",
      id: "createdAt",
      width: 25,
      render: (value: any) => {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "-";
        return date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      name: "Members",
      id: "members",
      width: 25,
      render: (value: any, row: any) => {
        let members: Array<any> = [];
        if (Array.isArray(value)) {
          members = [...members, ...value];
        }
        if (Array.isArray(row?.managers)) {
          members = [...members, ...row.managers];
        }
        if (Array.isArray(row?.qa)) {
          members = [...members, ...row.qa];
        }
        return (
          <ProjectMemberWrapper>
            <ProjectAvatars>
              {members?.slice(0, 5)?.map((v: any) => (
                <div key={v._id || Math.random()}>
                  <Tooltip title={v.name} arrow placement="top">
                    <span style={{ display: "inline-block" }}>
                      <AvatarP
                        img={v.profileImg}
                        initial={v.name}
                        width="2rem"
                        height="2rem"
                      />
                    </span>
                  </Tooltip>
                </div>
              ))}

              {members?.length > 5 && (
                <MembersNumber>+{members?.length - 5 || 0}</MembersNumber>
              )}
            </ProjectAvatars>

            <AddBtn
              onClick={() => {
                setSelectedProject(row);
                setAddMember(true);
                setAction("edit");
              }}
            >
              <span>Add User</span>
              {/* <Image src={PlusIcon} alt="" /> */}
            </AddBtn>
          </ProjectMemberWrapper>
        );
      },
    },

    {
      name: "Action",
      id: "edit",
      width: 25,
      render: (value: any, row: any) => {
        return (
          <div
            style={{
              display: "flex",
            }}
          >
            <Tooltip
              title={activeTab === 0 ? "Archive Project" : "Unarchive Project"}
            >
              <ActionBtn
                onClick={() => {
                  setSelectedProject(row);
                  handleActionWithAuth(
                    activeTab === 0 ? "Archive Project" : "Unarchive Project"
                  );
                }}
              >
                <Image
                  src={ArchiveBtnIcon}
                  width={20}
                  height={20}
                  alt="Archive"
                />
              </ActionBtn>
            </Tooltip>
            <Tooltip title="Delete">
              <ActionBtn
                onClick={() => {
                  setSelectedProject(row);
                  handleActionWithAuth("Delete Project");
                }}
              >
                <Image
                  src={DeleteBtnIcon}
                  width={20}
                  height={20}
                  alt="Archive"
                />
              </ActionBtn>
            </Tooltip>
            <Tooltip title="Edit">
              <ActionBtn
                onClick={() => {
                  setSelectedProject(row);
                  handleActionWithAuth("Edit Project");
                }}
              >
                <Image src={EditBtnIcon} width={20} height={20} alt="Archive" />
              </ActionBtn>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const delProject = async () => {
    setSuccess("loading");
    try {
      const { data } = await deleteProject({
        variables: {
          input: {
            projectIds: [selectedProject?.id],
          },
        },
      });
      setSuccess("true");
    } catch (error) {
      setSuccess("error");
    }
    // console.log(selectedProjects, user, "selected projects");
  };

  const bulkDeleteProject = async () => {
    setSuccess("loading");
    try {
      const { data } = await deleteProject({
        variables: {
          input: {
            projectIds: projectsSelected,
          },
        },
      });
      setSuccess("true");
    } catch (error) {
      setSuccess("error");
    }
  };
  const [
    editProject,
    { loading: editProjectLoading, error: editProjectError },
  ] = useMutation(UPDATE_PROJECT);

  const [
    bulkEditProject,
    { loading: bulkEditProjectLoading, error: bulkEditProjectError },
  ] = useMutation(UPDATE_PROJECT_STATUS);

  const archiveProject = async () => {
    setSuccess("loading");
    try {
      const { data } = await editProject({
        variables: {
          input: {
            ProjectId: selectedProject?.id,
            status: "ARCHIVED",
          },
        },
      });
      setSuccess("true");
    } catch (error) {
      setSuccess("error");
    }
  };
  const unArchiveProject = async () => {
    setSuccess("loading");
    try {
      const { data } = await editProject({
        variables: {
          input: {
            ProjectId: selectedProject?.id,
            status: "ACTIVE",
          },
        },
      });
      setSuccess("true");
    } catch (error) {
      setSuccess("error");
    }
  };

  const bulkUnArchiveProject = async () => {
    setSuccess("loading");
    try {
      const { data } = await bulkEditProject({
        variables: {
          input: {
            projectIds: projectsSelected,
            status: "ACTIVE",
          },
        },
      });
      setSuccess("true");
    } catch (error) {
      setSuccess("error");
    }
  };

  const bulkArchiveProject = async () => {
    setSuccess("loading");
    try {
      const { data } = await bulkEditProject({
        variables: {
          input: {
            projectIds: projectsSelected,
            status: "ARCHIVED",
          },
        },
      });

      setSuccess("true");
    } catch (error) {
      setSuccess("error");
    }
  };

  const [confirmAction, setConfirmAction] = useState(false);
  const [projectsSelected, setProjectsSelected] = useState<Array<any>>();
  const [externalActionModalOpen, setExternalActionModalOpen] = useState(false);
  const [addMember, setAddMember] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearInterval(timeoutRef.current);
    if (projectsSelected && projectsSelected?.length > 0) {
      timeoutRef.current = setTimeout(
        () => setExternalActionModalOpen(true),
        2000
      );
    } else {
      setExternalActionModalOpen(false);
    }
  }, [projectsSelected]);

  useEffect(() => {
    if (confirmAction) {
      switch (action) {
        case "delete":
          delProject();
          break;
        case "archive":
          archiveProject();
          break;
        case "unarchive":
          unArchiveProject();
          break;
      }
    }
  }, [confirmAction, action]);

  const LazyAddMemberModal = () => {
    if (addMember) {
      return (
        <AddMemberModal
          // key={Math.random()}
          action={action}
          handleClose={handleClose}
          open={addMember}
          selectedProject={selectedProject}
          onComplete={() => setActionComplete(true)}
        />
      );
    }
  };
  const ControlPanelDropdownData = useMemo(
    () => [
      {
        label: "Active",
        value: "0",
      },
      {
        label: "Archived",
        value: "1",
      },
    ],
    []
  );

  const isProjectManager = user?.userData?.role === "PROJECT_MANAGER";

  const renderProjectCard = (row: any) => {
    let members: Array<any> = [];
    if (Array.isArray(row?.members)) {
      members = [...members, ...row.members];
    }
    if (Array.isArray(row?.managers)) {
      members = [...members, ...row.managers];
    }
    if (Array.isArray(row?.qa)) {
      members = [...members, ...row.qa];
    }

    const createdAt = row.createdAt
      ? new Date(row.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

    return (
      <ProjectCard key={row.id}>
        <ProjectCardHeader>
          <ProjectCardNameSection>
            <AvatarP img={row.name?.image} initial={row.name?.name} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: "#1d2939", fontSize: "0.9rem" }}>
                {row.name?.name}
              </div>
            </div>
          </ProjectCardNameSection>
          <ProjectCardActions>
            <Tooltip title={activeTab === 0 ? "Archive Project" : "Unarchive Project"}>
              <ActionBtn
                onClick={() => {
                  setSelectedProject(row);
                  handleActionWithAuth(
                    activeTab === 0 ? "Archive Project" : "Unarchive Project"
                  );
                }}
              >
                <Image
                  src={ArchiveBtnIcon}
                  width={18}
                  height={18}
                  alt="Archive"
                />
              </ActionBtn>
            </Tooltip>
            <Tooltip title="Delete">
              <ActionBtn
                onClick={() => {
                  setSelectedProject(row);
                  handleActionWithAuth("Delete Project");
                }}
              >
                <Image
                  src={DeleteBtnIcon}
                  width={18}
                  height={18}
                  alt="Delete"
                />
              </ActionBtn>
            </Tooltip>
            <Tooltip title="Edit">
              <ActionBtn
                onClick={() => {
                  setSelectedProject(row);
                  handleActionWithAuth("Edit Project");
                }}
              >
                <Image src={EditBtnIcon} width={18} height={18} alt="Edit" />
              </ActionBtn>
            </Tooltip>
          </ProjectCardActions>
        </ProjectCardHeader>
        <ProjectCardInfo>
          <ProjectCardRow>
            <ProjectCardLabel>Created:</ProjectCardLabel>
            <ProjectCardValue>{createdAt}</ProjectCardValue>
          </ProjectCardRow>
          <ProjectCardRow>
            <ProjectCardLabel>Members:</ProjectCardLabel>
            <ProjectMemberWrapper style={{ width: "auto", justifyContent: "flex-start" }}>
              <ProjectAvatars style={{ width: "auto" }}>
                {members?.slice(0, 5)?.map((v: any) => (
                  <div key={v._id || Math.random()}>
                    <Tooltip title={v.name} arrow placement="top">
                      <span style={{ display: "inline-block" }}>
                        <AvatarP
                          img={v.profileImg}
                          initial={v.name}
                          width="1.75rem"
                          height="1.75rem"
                        />
                      </span>
                    </Tooltip>
                  </div>
                ))}
                {members?.length > 5 && (
                  <MembersNumber>+{members?.length - 5 || 0}</MembersNumber>
                )}
              </ProjectAvatars>
              <AddBtn
                onClick={() => {
                  setSelectedProject(row);
                  setAddMember(true);
                  setAction("edit");
                }}
              >
                <span>Add User</span>
              </AddBtn>
            </ProjectMemberWrapper>
          </ProjectCardRow>
        </ProjectCardInfo>
      </ProjectCard>
    );
  };

  return (
    <>
      <CustomTitleBar title="Project Management">
        <ControlPanel
          key={`projects-dropdown-${activeTab}`}
          dropdownData={{
            defaultValue: `${activeTab}`,
            data: ControlPanelDropdownData,
            setValue: (value) => {
              toggleTab(value);
            },
          }}
          searchBox={{
            placeholder: "Search Project",
            searchBoxFunc: (value) => {
              setSearchInput(value);
            },
          }}
          actionBtns={
            isProjectManager
              ? []
              : [
                  {
                    actionBtnText: "Add Project",
                    actionBtnFunc: () => {
                      handleOpen();
                    },
                    actionBtnIcon: AddIcon,
                  },
                ]
          }
        />
      </CustomTitleBar>
      
      <AnalyticsCardsContainer>
        <AnalyticsCard>
          <AnalyticsCardHeader>
            <AnalyticsCardTitle>Total Projects</AnalyticsCardTitle>
            <AnalyticsIconWrapper style={{ backgroundColor: '#EEF4FF' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="3" width="7" height="7" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="14" width="7" height="7" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="14" width="7" height="7" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </AnalyticsIconWrapper>
          </AnalyticsCardHeader>
          <AnalyticsCardValue>{totalProjectsCount || 0}</AnalyticsCardValue>
        </AnalyticsCard>

        <AnalyticsCard>
          <AnalyticsCardHeader>
            <AnalyticsCardTitle>Active Projects</AnalyticsCardTitle>
            <AnalyticsIconWrapper style={{ backgroundColor: '#ECFDF5' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </AnalyticsIconWrapper>
          </AnalyticsCardHeader>
          <AnalyticsCardValue>{activeCount || 0}</AnalyticsCardValue>
        </AnalyticsCard>

        <AnalyticsCard>
          <AnalyticsCardHeader>
            <AnalyticsCardTitle>Archived Projects</AnalyticsCardTitle>
            <AnalyticsIconWrapper style={{ backgroundColor: '#FEF3C7' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 8V21H3V8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 3H1V8H23V3Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 12H14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </AnalyticsIconWrapper>
          </AnalyticsCardHeader>
          <AnalyticsCardValue>{archivedCount || 0}</AnalyticsCardValue>
        </AnalyticsCard>
      </AnalyticsCardsContainer>
      
      <Container>
        <ProjectsWrapper>
          <NewProjectModal
            action={action}
            handleClose={handleClose}
            open={open}
            selectedProject={selectedProject}
            onComplete={() => setActionComplete(true)}
            existingProjects={tableData}
          />
          {LazyAddMemberModal()}
          <ConfirmNotification
            selected={selectedProject}
            action={action}
            open={confirmModal}
            close={closeConfirmModal}
            handleConfirm={() => setConfirmAction(true)}
            onSwitchToArchive={() => {
              setAction("archive");      
              setTimeout(() => {
                setConfirmAction(true);
              }, 0);
            }}
            success={success}
          />
          <ExternalActionModal
            deleteBtn={async () => {
              await bulkDeleteProject();
            }}
            firstBtn={async () => {
              if (activeTab === 1) {
                await bulkUnArchiveProject();
              } else {
                await bulkArchiveProject();
              }
            }}
            firstBtnText={activeTab === 0 ? "Archive" : "Unarchive"}
            selected={projectsSelected?.length || 0}
            unselectBtn={() => {
              setProjectsSelected([]);
              setExternalActionModalOpen(false);
            }}
            handleClose={() => {
              setExternalActionModalOpen(false);
            }}
            open={externalActionModalOpen}
            actionSuccess={success}
          />
          <ProjectHeaderWrapper>
            <ProjectHeaderLeftSide>
              <h3>Projects</h3>
              <span className="no_of_Projects">{`${
                activeTab === 1 ? archivedCount || 0 : activeCount || 0
              } Project${(activeTab === 1 ? archivedCount || 0 : activeCount || 0) > 1 ? "s" : ""}`}</span>
            </ProjectHeaderLeftSide>
          </ProjectHeaderWrapper>
          <ProjectTable>
            <CustomTable
              key={activeTab}
              onSelect={(e) => {
                setProjectsSelected(e);
              }}
              columns={columns}
              data={tableData}
              selectedRows={projectsSelected}
            />
          </ProjectTable>
          <ProjectCardsContainer>
            {tableData?.map((row: any) => renderProjectCard(row))}
          </ProjectCardsContainer>
        </ProjectsWrapper>
      </Container>
    </>
  );
};

export default Projects;

// Analytics Cards Styles
const AnalyticsCardsContainer = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "1.25rem",
  padding: "2.5rem 3rem 0rem",
  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
  },
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
    gap: "1rem",
    padding: "1rem 0",
  },
}));

const AnalyticsCard = styled("div")(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: "8px",
  border: "1px solid #EAECF0",
  padding: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  [theme.breakpoints.down("md")]: {
    padding: "1.25rem",
  },
}));

const AnalyticsCardHeader = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const AnalyticsCardTitle = styled("div")(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#6B7280",
  lineHeight: "1.25rem",
  [theme.breakpoints.down("md")]: {
    fontSize: "0.8125rem",
  },
}));

const AnalyticsIconWrapper = styled("div")(({ theme }) => ({
  width: "40px",
  height: "40px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    width: "36px",
    height: "36px",
  },
}));

const AnalyticsCardValue = styled("div")(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: 600,
  color: "#111827",
  lineHeight: "2.5rem",
  [theme.breakpoints.down("md")]: {
    fontSize: "1.75rem",
    lineHeight: "2.25rem",
  },
}));

const ActionBtn = styled("button")`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  //   padding: 0.6rem;
  width: 2.5rem;
  cursor: pointer;
  height: 2.5rem;
  transition: background-color 0.2s ease;
  border-radius: 4px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }

  > img {
    width: 60%;
  }

  @media (max-width: 1024px) {
    width: 2.25rem;
    height: 2.25rem;
  }

  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
    min-width: 2rem;
    min-height: 2rem;
    touch-action: manipulation;
  }
`;

const ProjectHeaderWrapper = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.2rem;

  @media (max-width: 1024px) {
    padding: 1.2rem 1rem;
  }

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
  }
`;

const ProjectHeaderLeftSide = styled("div")`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  > h3 {
    color: #101828;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 600;
    line-height: 1.75rem;
  }

  > .no_of_Projects {
    border-radius: 1rem;
    border: 1px solid #50589f;
    background: #eef0ff;
    mix-blend-mode: multiply;
    font-size: 0.76rem;
    line-height: 1.15rem;
    font-weight: 500;
    color: #50589f;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  @media (max-width: 1024px) {
    > h3 {
      font-size: 1rem;
      line-height: 1.5rem;
    }

    > .no_of_Projects {
      font-size: 0.7rem;
      padding-left: 0.4rem;
      padding-right: 0.4rem;
    }
  }

  @media (max-width: 768px) {
    gap: 0.4rem;
    > h3 {
      font-size: 0.95rem;
      line-height: 1.4rem;
    }

    > .no_of_Projects {
      font-size: 0.65rem;
      line-height: 1rem;
      padding-left: 0.35rem;
      padding-right: 0.35rem;
    }
  }
`;
