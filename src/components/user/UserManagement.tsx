import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "@/config/axiosConfig";
import { apiUrl } from "@/config/apiUrl";
import CustomTable from "../Table/index";
import SearchIcon from "@mui/icons-material/Search";
import UploadIcon from "@mui/icons-material/Upload";
import PlusIcon from "@mui/icons-material/AddBox";
import SlashCircleIcon from "@mui/icons-material/Block";
import AddIcon from "@mui/icons-material/Add";
import EditBtnIcon from "@mui/icons-material/Edit";
import DeleteBtnIcon from "@mui/icons-material/Delete";
import InviteIcon from "@mui/icons-material/PersonAddAlt1";
import ActiveIcon from "@mui/icons-material/CheckCircle";
import UserSuspendIcon from "@mui/icons-material/PersonOff";
import UserUpdateIcon from "@mui/icons-material/ManageAccounts";
import UserDeleteIcon from "@mui/icons-material/PersonRemove";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ViewColumnsIcon from "@mui/icons-material/ViewColumn";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  Box,
  styled,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Button,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Checkbox,
  Typography,
  Stack,
  FormControlLabel,
  Skeleton,
} from "@mui/material";
import AvatarP from "../avatar";
import useUserPage from "@/hooks/user/use-user-page";
import { useRouter } from "next/router";
// @ts-ignore
import exportFromJSON from "export-from-json";
import useUserPageGraphql from "@/hooks/user/use-user-page-graphql";
import useDailyTotalsGraphql from "@/hooks/reports/use-daily-totals-graphql";
import EmptyUsersImage from "../../assets/img/empty-users.svg";
import { Theme } from "@mui/material";
import { calculatePxToPercentage } from "@/../utils/cssHelper";

const CustomText = styled(Typography)(({ theme }) => ({
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

const Heading = styled(Stack)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: calculatePxToPercentage(10),
  padding: `0 ${calculatePxToPercentage(24)}`,
  width: "100%",
  borderBottom: "0.0521vw",
}));
import { notifyErrorFxn, notifySuccessFxn } from "@/utils/toast-fxn";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { UPDATE_USER } from "@/graphql/mutations/user";
import { IUser } from "./types";
import ConfirmDialogBox, {
  MainMessage,
  MainMessageBlue,
  NewLine,
  SubMessage,
} from "../modal/ConfirmDialogBox";
import AssignProjectForm from "./AssignProjectForm";
import DialogBox from "../modal/DialogBox";
import ExternalActionModal from "../projects/ExternalActionModal";
import ControlPanel from "../common/TitleBar/ControlPanel";
import Container from "../Layout/Container";
import AddMembersForm from "./AddMembersForm";
import userAtom from "@/atoms/user-atom";
import { useRecoilState } from "recoil";
import useLocationOptions from "@/hooks/team/use-location-options";
import ProjectsTooltip from "./ProjectsTooltip";

interface ITableCellTextBlue {
  addMarginLeft?: boolean;
  marginLeftValue?: number | string;
}

interface AppPricing {
  _id: string;
  appId: string;
  name: string;
  isActive: boolean;
  maxSeats: number;
}

interface PricingData {
  pricing: {
    ownerAndManager: number;
    member: number;
  };
  apps: AppPricing[];
}

const Users: React.FC = () => {
  const {
    runGetProjectsQuery,
    addProjectMember,
    deleteUser,
    deleteMultipleUsers,
    reInviteUser,
    loading: gqlLoading,
  } = useUserPageGraphql();
  const {
    updateUserPage,
    userPageState,
    unSelectUsers,
    getAssignedProjects,
    getUserInfo,
  } = useUserPage();
  const [activeTab, setActiveTab] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [tableData, setTableData] = useState<Array<any>>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);
  const [invitedCount, setInvitedCount] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [appCounts, setAppCounts] = useState<Record<string, number>>({});
  const [user] = useRecoilState(userAtom);
  const [billedCount, setBilledCount] = useState(0);
  const [openAppAccess, setOpenAppAccess] = useState(false);
  const [selectedSeatId, setSelectedSeatId] = useState("");
  const [currentAppAccess, setCurrentAppAccess] = useState<string[]>([]);
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [appsLoading, setAppsLoading] = useState(true);

  const [locationFilterAnchorEl, setLocationFilterAnchorEl] =
    useState<null | HTMLElement>(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  const formatRole = React.useCallback((role: string) => {
    return role === "ORGANIZATION_OWNER"
      ? "Organisation owner"
      : role === "ORGANIZATION_MANAGER"
        ? "Organisation manager"
        : role === "PROJECT_MANAGER"
          ? "Project Manager"
          : role === "USER" || role === "Member"
            ? "User"
            : "Viewer";
  }, []);

  const formatStatus = React.useCallback(
    (status: string, acceptedInvite: boolean): string => {
      if (!status) return "";
      const statusLower = status.toLowerCase();
      if (statusLower === "active") return "Active";
      if (["suspended", "archive", "deleted"].includes(statusLower))
        return "Inactive";
      if (statusLower === "invited" || acceptedInvite === false)
        return "Invited";
      return status;
    },
    [],
  );

  const formatDate = React.useCallback((dateString: string | Date): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Invalid Date";
    }
  }, []);

  const getActiveTabText = React.useCallback((): string => {
    if (activeTab === 0) return "ACTIVE";
    if (activeTab === 1) return "INACTIVE";
    return "INVITED";
  }, [activeTab]);

  const fetchUserStats = React.useCallback(async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/v1/organization/stats`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const stats = res.data.data;
        setTotalUsersCount(stats.total);
        setActiveCount(stats.active);
        setInvitedCount(stats.invited);
        setArchivedCount(stats.inactive);
        setBilledCount(stats.billed);
        setAppCounts(stats.appCounts);
      }
    } catch (err) {
      console.error("Failed to fetch user stats:", err);
    }
  }, []);

  const fetchData = React.useCallback(
    async (params?: { status?: string; location?: string }) => {
      try {
        setAppsLoading(true);
        fetchUserStats(); // Independent metrics fetch
        const status = params?.status || getActiveTabText();
        const location = params?.location || selectedLocation;

        const res = await axios.get(`${apiUrl}/api/admin/users`, {
          params: {
            status,
            location: location || undefined,
            limit: 100,
          },
          withCredentials: true,
        });

        if (res.data.success) {
          const rawUsers = res.data.data.users;
          const mappedUsers = rawUsers.map((u: any) => ({
            id: u._id,
            name: u.name,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            image: u.profileImg,
            role: formatRole(u.role),
            rawRole: u.role,
            status: formatStatus(u.seatStatus || u.status, true),
            apps: u.appAccess || [],
            source: u.source || "core",
            location: u.location || "",
            date: formatDate(u.createdAt),
          }));
          updateUserPage({ users: mappedUsers });
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setAppsLoading(false);
      }
    },
    [
      getActiveTabText,
      selectedLocation,
      updateUserPage,
      formatRole,
      formatStatus,
      formatDate,
      fetchUserStats,
    ],
  );

  useEffect(() => {
    const initFetch = async () => {
      try {
        const pricingResponse = await axios.get(`${apiUrl}/api/admin/pricing`, {
          withCredentials: true,
        });
        if (pricingResponse.data.success) {
          setPricingData(pricingResponse.data.data);
        }
        await fetchData();
      } catch (err) {
        console.error("Init fetch failed:", err);
      }
    };
    initFetch();
  }, [fetchData]);

  const handleAppAccessEdit = (clientId: string, apps: string[]) => {
    setSelectedSeatId(clientId);
    setCurrentAppAccess(apps);
    setOpenAppAccess(true);
  };

  const [columnMenuAnchorEl, setColumnMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userTableVisibleColumns");
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return ["user", "email", "role", "apps", "status", "date", "edit"];
  });
  const theme = useTheme();
  const router = useRouter();
  const { getProjectsName } = useUserPage();

  // Media queries for responsive design
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const showCardLayout = isMobile || isTablet;

  // Fetch locations dynamically from teams database
  const { locationOptions } = useLocationOptions();

  const locationValues = React.useMemo(
    () =>
      locationOptions
        .map((option) => option.value)
        .filter((value): value is string =>
          Boolean(value && value.trim().length),
        ),
    [locationOptions],
  );

  const getLocationCounts = React.useCallback(() => {
    const userData = userPageState?.users || [];
    const counts: Record<string, number> = {};

    locationValues.forEach((value) => {
      counts[value] = 0;
    });

    const filteredUsers = userData.filter((user: any) => {
      if (activeTab === 0) {
        return (
          user?.status?.toLowerCase() === "active" &&
          user.acceptedInvite !== false
        );
      } else if (activeTab === 1) {
        return (
          ["archive", "suspended", "deleted"].includes(
            user?.status?.toLowerCase(),
          ) && user.acceptedInvite !== false
        );
      } else {
        return (
          user?.status?.toLowerCase() === "invited" ||
          user.acceptedInvite === false
        );
      }
    });

    filteredUsers.forEach((user: any) => {
      const loc = (user?.location || "").toLowerCase();

      locationValues.forEach((value) => {
        if (loc.includes(value)) {
          counts[value] = (counts[value] || 0) + 1;
        }
      });
    });

    return counts;
  }, [userPageState?.users, activeTab, locationValues]);

  const locationCounts = React.useMemo(
    () => getLocationCounts(),
    [getLocationCounts],
  );

  const getLocationLabel = (locationValue: string, label: string) => {
    if (locationValue === "") {
      return "All Team";
    }

    const count =
      locationCounts[locationValue as keyof typeof locationCounts] || 0;
    return `${label} (${count})`;
  };

  const memoizedLocationOptions = React.useMemo(
    () =>
      locationOptions.map((option) => ({
        ...option,
        count: locationCounts[option.value] || 0,
      })),
    [locationCounts, locationOptions],
  );

  const handleLocationFilterClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setLocationFilterAnchorEl(event.currentTarget);
  };

  const handleLocationFilterClose = () => {
    setLocationFilterAnchorEl(null);
  };

  const handleLocationFilterSelect = (locationValue: string) => {
    setSelectedLocation(locationValue);

    fetchData({
      status: getActiveTabText(),
      location: locationValue,
    });
  };

  const getAppIcon = (appId: string) => {
    switch (appId) {
      case "recruit":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
              stroke="#9333EA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
              stroke="#9333EA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "tracker":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 6V12L16 14"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  const getAppIconBg = (appId: string) => {
    switch (appId) {
      case "recruit":
        return "#F3E8FF";
      case "tracker":
        return "#ECFDF5";
      default:
        return "#EEF4FF";
    }
  };

  const handleSearch = React.useCallback(
    (userData: any) => {
      return `${userData?.firstName} ${userData?.lastName}`
        ?.toLowerCase()
        .includes(searchInput.toLowerCase());
    },
    [searchInput],
  );

  const editUser = async (clientId: string, targetStatus: string) => {
    try {
      const res = await axios.patch(
        `${apiUrl}/api/admin/users/${clientId}/status`,
        {
          status: targetStatus,
          reason: `Status updated to ${targetStatus} from Settings App`,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        notifySuccessFxn(`User status updated to ${targetStatus}`);
        await fetchData();
        unSelectUsers();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update user status:", err);
      notifyErrorFxn("Failed to update user status");
      return false;
    }
  };

  const suspendMultipleUsers = async (targetStatus: string) => {
    try {
      const selectedUsers = userPageState.selectedUsers;
      if (!selectedUsers.length) return;

      // Bridging multiple status updates to REST (Sequential for now, or implement bulk endpoint)
      await Promise.all(
        selectedUsers.map((id) =>
          axios.patch(
            `${apiUrl}/api/admin/users/${id}/status`,
            {
              status: targetStatus,
            },
            { withCredentials: true },
          ),
        ),
      );

      notifySuccessFxn(`Users updated to ${targetStatus}`);
      await fetchData();
      unSelectUsers();
    } catch (err) {
      console.error("Failed to update multiple users:", err);
      notifyErrorFxn("Failed to update multiple users");
    }
  };

  useEffect(() => {
    if (userPageState?.users) {
      const filteredUsers = userPageState.users.filter((user: any) => {
        let statusMatch = false;

        if (activeTab === 0) {
          statusMatch = user?.status?.toLowerCase() === "active";
        } else if (activeTab === 1) {
          statusMatch = ["archive", "suspended", "deleted"].includes(
            user?.status?.toLowerCase(),
          );
        } else {
          statusMatch = user?.status?.toLowerCase() === "invited";
        }

        const locationMatch =
          selectedLocation === "" ||
          (user?.location || "").toLowerCase().includes(selectedLocation);

        const searchMatch = handleSearch(user);

        return statusMatch && locationMatch && searchMatch;
      });

      setTableData(
        filteredUsers?.map((data: any) => {
          const userIsBilled = (data.apps || []).length > 0;
          return {
            ...data,
            user: {
              name: data.name || `${data.firstName} ${data.lastName}`,
              id: data.id,
              isBilledSeat: userIsBilled,
            },
            isBilledSeat: userIsBilled,
            numOfProjects:
              data.projectList?.length || data.projects?.length || 0,
            projectList: data.projectList || data.projects || [],
            id: data.id,
            status: formatStatus(data.status, data.acceptedInvite),
            apps: data.apps || [],
          };
        }),
      );
    }
  }, [
    userPageState.users,
    activeTab,
    selectedLocation,
    searchInput,
    handleSearch,
    formatStatus,
  ]);

  const allAvailableColumns = [
    {
      name: "User",
      id: "user",
      render: (value: any) => {
        return (
          <UserNameWrapper>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <span>{value.name}</span>
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  flexWrap: "wrap",
                  marginTop: "4px",
                }}
              >
                {value.isBilledSeat && (
                  <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-[6px] py-[2px] rounded-[4px] font-medium border border-[#A5D6A7]">
                    Billed Seat
                  </span>
                )}
                {value.source === "tracker" && (
                  <span className="text-[10px] bg-[#FFF4ED] text-[#C4320A] px-[6px] py-[2px] rounded-[4px] font-medium border border-[#FED7AA]">
                    Tracker
                  </span>
                )}
                {value.source === "recruit" && (
                  <span className="text-[10px] bg-[#F5F3FF] text-[#7C3AED] px-[6px] py-[2px] rounded-[4px] font-medium border border-[#DDD6FE]">
                    Recruit
                  </span>
                )}
                {value.source === "merged" && (
                  <span className="text-[10px] bg-[#EFF6FF] text-[#2563EB] px-[6px] py-[2px] rounded-[4px] font-medium border border-[#DBEAFE]">
                    Recruit + Tracker
                  </span>
                )}
              </div>
            </div>
          </UserNameWrapper>
        );
      },
    },
    {
      name: "Email",
      id: "email",
    },
    {
      name: "Role",
      id: "role",
      render: (value: any) => {
        const inputString = value;
        let formattedString = "";

        const words = inputString.toLowerCase().split("_");
        formattedString = words
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return formattedString;
      },
    },
    {
      name: "Team",
      id: "location",
      render: (value: any) => {
        if (!value) return "Not specified";
        return value
          .toLowerCase()
          .split(" ")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      },
    },
    {
      name: "Apps",
      id: "apps",
      render: (value: any, row: any) => {
        const apps = value || [];
        return (
          <div
            style={{ display: "flex", gap: "4px", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              handleAppAccessEdit(row.id, apps);
            }}
          >
            {apps.length > 0 ? (
              apps.map((app: string) => (
                <span
                  key={app}
                  style={{
                    fontSize: "12px",
                    background: "#F2F4F7",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    color: "#344054",
                    border: "1px solid #D0D5DD",
                  }}
                >
                  {app.charAt(0).toUpperCase() + app.slice(1)}
                </span>
              ))
            ) : (
              <span style={{ color: "#98A2B3", fontSize: "12px" }}>
                No Apps
              </span>
            )}
          </div>
        );
      },
    },

    {
      name: "Status",
      id: "status",
      width: 10,
    },
    {
      name: "Date Added",
      id: "date",
      render: (value: any) => {
        const date: Date = new Date(value);
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "short",
          day: "2-digit",
        };
        const formattedDate: string = date.toLocaleString("en-US", options);
        return formattedDate;
      },
    },

    {
      name: "Actions",
      id: "edit",
      width: 12,
      render: (value: any, row: any) => {
        const hideInvite = activeTab !== 2;
        const hideSuspend = activeTab !== 0;
        const hideActive =
          activeTab !== 1 || row.status?.toLowerCase() === "deleted";
        const hideEdit = activeTab === 1;
        return (
          <div
            style={{
              display: "flex",
            }}
          >
            <Tooltip title="Edit">
              <ActionBtn
                hide={hideEdit}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChange("editUser", row.id);
                }}
              >
                <EditBtnIcon />
              </ActionBtn>
            </Tooltip>
            <Tooltip title="Suspend">
              <ActionBtn
                hide={hideSuspend}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChange("suspendAccess", row.id);
                }}
              >
                <SlashCircleIcon width={20} height={20} />
              </ActionBtn>
            </Tooltip>
            <Tooltip title="Activate">
              <ActionBtn
                hide={hideActive}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChange("restoreAccess", row.id);
                }}
              >
                <ActiveIcon />
              </ActionBtn>
            </Tooltip>
            <Tooltip title="Reinvite">
              <ActionBtn
                hide={hideInvite}
                onClick={(e) => {
                  e.stopPropagation();
                  const userInfo = getUserInfo(row.id) || row;
                  handleChange("reInviteUser", row.id, userInfo);
                }}
              >
                <InviteIcon />
              </ActionBtn>
            </Tooltip>
            <Tooltip title="Delete">
              <ActionBtn
                onClick={(e) => {
                  e.stopPropagation();
                  handleChange("deleteUser", row.id);
                }}
              >
                <DeleteBtnIcon width={18} height={18} />
              </ActionBtn>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  // Filter columns based on visible columns
  const columns = allAvailableColumns.filter((col) =>
    visibleColumns.includes(col.id),
  );

  // Column management functions
  const handleColumnMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setColumnMenuAnchorEl(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchorEl(null);
  };
  const toggleColumn = (columnId: string) => {
    if (columnId === "user" || columnId === "edit") return;

    setVisibleColumns((prev) => {
      const newColumns = prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId];

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "userTableVisibleColumns",
          JSON.stringify(newColumns),
        );
      }

      return newColumns;
    });
  };
  const getAvailableColumnsForMenu = () => {
    return allAvailableColumns.filter(
      (col) => col.id !== "user" && col.id !== "edit",
    );
  };

  const [open, setOpen] = useState(false);

  const [selectedUser, setSelectedUser] = React.useState("");
  const [userDetails, setUserDetails] = React.useState<IUser>();
  const [selectedProjects, setSelectedProjects] = React.useState<
    (string | number)[]
  >([]);
  const [openBatchModal, setOpenBatchModal] = React.useState(false);
  const [dialogProps, setDialogProps] = useState({
    mainText: "",
    mainTextBlue: "",
    subText: "",
    accept: () => {},
    cancel: (val: boolean) => {},
    buttonCancelText: "",
    buttonAcceptText: "",
    buttonOk: false,
    ok: () => {},
    buttonAcceptColor: "",
    addNewLine: true,
    questionMark: true,
    headerImgUrl: "" as React.ReactNode,
  });
  const [showDialog, setShowDialog] = useState(false);

  const showDialogBox = (
    mainText: string,
    mainTextBlue: string,
    subText: string,
    accept: () => void,
    cancel: (val: boolean) => void,
    buttonOk: boolean,
    ok: () => void,
    buttonCancelText?: string,
    buttonAcceptText?: string,
    buttonAcceptColor?: string,
    addNewLine?: boolean,
    questionMark?: boolean | undefined,
    headerImgUrl?: React.ReactNode,
  ) => {
    setDialogProps({
      mainText: mainText,
      mainTextBlue: mainTextBlue,
      subText: subText,
      accept: accept,
      cancel: cancel,
      buttonCancelText: buttonCancelText || "",
      buttonAcceptText: buttonAcceptText || "",
      buttonOk: buttonOk,
      ok: ok,
      buttonAcceptColor: buttonAcceptColor || "",
      addNewLine: addNewLine ? addNewLine : false,
      questionMark: questionMark ? true : false,
      headerImgUrl: headerImgUrl ? headerImgUrl : "",
    });
    setShowDialog(true);
  };
  const handleChange = async (
    value: string,
    userId: string,
    userData?: any,
  ) => {
    if (!userId || userId.trim() === "") {
      showDialogBox(
        "Operation Error",
        "Invalid User ID",
        "Unable to process action: Invalid user ID. Please refresh the page and try again.",
        () => {},
        () => {
          setShowDialog(false);
        },
        true,
        () => {
          setShowDialog(false);
        },
        "",
        "OK",
        "",
        false,
        false,
        <UserUpdateIcon />,
      );
      setShowDialog(true);
      return;
    }

    setSelectedUser(userId);

    const userInfo = userData || getUserInfo(userId);

    if (!userInfo) {
      showDialogBox(
        "Operation Error",
        "User Not Found",
        "Unable to find user details. Please refresh the page and try again.",
        () => {},
        () => {
          setShowDialog(false);
        },
        true,
        () => {
          setShowDialog(false);
        },
        "",
        "OK",
        "",
        false,
        false,
        <UserUpdateIcon />,
      );
      setShowDialog(true);
      return;
    }

    setUserDetails(userInfo);

    if (value === "assignProjects") {
      setSelectedProjects(getAssignedProjects(userId)?.map((d: any) => d._id));
      setOpen(true);
    } else if (value === "suspendAccess" || value === "restoreAccess") {
      if (
        value === "restoreAccess" &&
        userInfo.status?.toLowerCase() === "deleted"
      ) {
        showDialogBox(
          "Operation Not Allowed",
          "Cannot Restore Deleted User",
          "Deleted users cannot be restored. You would need to invite this user again if you want them to regain access.",
          () => {},
          () => {
            setShowDialog(false);
          },
          true,
          () => {
            setShowDialog(false);
          },
          "",
          "OK",
          "",
          false,
          false,
          <UserUpdateIcon />,
        );
        setShowDialog(true);
        return;
      }

      showDialogBox(
        "Are you sure you want to",
        `${value === "suspendAccess" ? "Suspend" : "Restore"} ${userInfo.name || userInfo.email}'s Access`,
        `Take a moment to confirm. Are you certain about ${
          value === "suspendAccess" ? "suspending" : "restoring"
        } access of
        ${userInfo.name || userInfo.email}?`,
        () => {
          editUserAccess(
            value === "suspendAccess" ? "SUSPENDED" : "ACTIVE",
            userInfo,
            userId,
          );
        },
        () => {
          setOpen(false);
          setShowDialog(false);
        },
        false,
        () => {},
        "Cancel",
        "Yes, I'm sure.",
        "",
        false,
        false,
        <UserUpdateIcon />,
      );
      setShowDialog(true);
    } else if (value === "deleteUser") {
      showDialogBox(
        "Are you sure you want to",
        `Delete ${userInfo.name || userInfo.email} from Users`,
        `Take a moment to confirm. Are you certain about deleting
        ${userInfo.name || userInfo.email}?`,
        () => {
          deleteUserFunc(userId);
        },
        () => {
          setOpen(false);
          setShowDialog(false);
        },
        false,
        () => {},
        "Cancel",
        "Save Changes",
        "#ED4D2E",
        true,
        true,
        <UserDeleteIcon />,
      );
      setShowDialog(true);
    } else if (value === "editUser") {
      router.push(`/user/add-user?sId=${userId}&edit=${true}`);
    } else if (value === "reInviteUser") {
      showDialogBox(
        "Are you sure you want to",
        `Re invite ${userInfo.name || userInfo.email}`,
        `Take a moment to confirm. Are you certain about Re inviting
        ${userInfo.name || userInfo.email}?`,
        () => {
          reInviteUserFunc(userInfo);
        },
        () => {
          setOpen(false);
          setShowDialog(false);
        },
        false,
        () => {},
        "Cancel",
        "Re Invite",
        "",
        true,
        true,
        <UserUpdateIcon />,
      );
      setShowDialog(true);
    }
  };

  const addUserToProject = async () => {
    let res = await addProjectMember(selectedProjects, selectedUser);
    if (res?.addNewProjects) {
      showDialogBox(
        "User",
        `Updated!`,
        `${
          userDetails?.name || userDetails?.email
        } successfully has newly updated access`,
        () => {},
        () => {},
        true,
        () => {
          setOpen(false);
          setShowDialog(false);
        },
        "",
        "",
        "",
        false,
        false,
        <UserUpdateIcon />,
      );
      setShowDialog(true);
    } else {
      showDialogBox(
        "User update",
        `Error!`,
        `${
          userDetails?.name || userDetails?.email
        }'s access could not be updated. Please try again later.`,
        () => {},
        () => {},
        true,
        () => {
          setOpen(false);
          setShowDialog(false);
        },
        "",
        "",
        "",
        false,
        false,
        <UserUpdateIcon />,
      );
      setShowDialog(true);
    }
  };

  const editUserAccess = async (
    access: string,
    userInfo = userDetails,
    userId = selectedUser,
  ) => {
    try {
      // Use the passed userId parameter to avoid race conditions with state
      if (!userId || userId.trim() === "") {
        throw new Error("Invalid user ID");
      }

      // If we still don't have user info, try to get it again
      if (!userInfo || (!userInfo.name && !userInfo.email)) {
        const refreshedUserInfo = getUserInfo(userId);
        if (refreshedUserInfo) {
          userInfo = refreshedUserInfo;
          setUserDetails(refreshedUserInfo); // Update state as well
        } else {
          throw new Error("Cannot retrieve user information");
        }
      }

      // Get current projects for this user if not already set
      const projects =
        selectedProjects?.length > 0
          ? selectedProjects
          : getAssignedProjects(userId)?.map((p: any) => p._id) || [];

      // Call the editUser function with the status (clientId, targetStatus)
      let success = await editUser(userId, access);

      if (success) {
        // Show success message with appropriate details based on the action
        showDialogBox(
          access === "SUSPENDED" ? "User Suspended" : "Access Restored",
          access === "SUSPENDED"
            ? "Successfully Suspended!"
            : "Successfully Restored!",
          access === "SUSPENDED"
            ? `${userInfo?.name || userInfo?.email}'s account has been suspended.`
            : `${userInfo?.name || userInfo?.email}'s access has been successfully restored.`,
          () => {},
          () => {},
          true,
          async () => {
            setOpen(false);
            setShowDialog(false);
          },
          "",
          "",
          "",
          false,
          false,
          access === "SUSPENDED" ? <UserSuspendIcon /> : <UserUpdateIcon />,
        );
        setShowDialog(true);
      }
    } catch (error) {
      // Extract error message if available
      let errorMsg = "An unexpected error occurred. Please try again later.";
      if (error instanceof Error) {
        errorMsg = error.message;
      }

      showDialogBox(
        "Operation Failed",
        "Error!",
        errorMsg,
        () => {},
        () => {},
        true,
        () => {
          setOpen(false);
          setShowDialog(false);
        },
        "",
        "",
        "",
        false,
        false,
        <UserSuspendIcon />,
      );
      setShowDialog(true);
    }
  };

  const suspendMultiple = async (status = "SUSPENDED") => {
    try {
      if (!userPageState.selectedUsers?.length) {
        showDialogBox(
          "Operation Failed",
          "No Users Selected",
          "Please select at least one user to perform this action.",
          () => {},
          () => {},
          true,
          () => {
            setOpen(false);
            setShowDialog(false);
          },
          "",
          "",
          "",
          false,
          false,
          <UserUpdateIcon />,
        );
        setShowDialog(true);
        return;
      }

      await suspendMultipleUsers(status);

      showDialogBox(
        status === "SUSPENDED" ? "Users Suspended" : "Access Restored",
        status === "SUSPENDED"
          ? "Successfully Suspended!"
          : "Successfully Restored!",
        status === "SUSPENDED"
          ? "Selected users have been suspended."
          : "Selected users' access has been successfully restored.",
        () => {},
        () => {},
        true,
        async () => {
          setOpen(false);
          setShowDialog(false);
        },
        "",
        "",
        "",
        false,
        false,
        status === "SUSPENDED" ? <UserSuspendIcon /> : <UserUpdateIcon />,
      );
      setShowDialog(true);
    } catch (error) {
      // Extract error message if available
      let errorMsg = "An unexpected error occurred. Please try again later.";
      if (error instanceof Error) {
        errorMsg = error.message;
      }

      showDialogBox(
        "Operation Failed",
        "Error!",
        errorMsg,
        () => {},
        () => {},
        true,
        () => {
          setOpen(false);
          setShowDialog(false);
        },
        "",
        "",
        "",
        false,
        false,
        <UserDeleteIcon />,
      );
      setShowDialog(true);
    }
  };

  const deleteUserFunc = async (selectedUser: string) => {
    let res = await deleteUser(selectedUser);
    if (res?.deleteUser) {
      showDialogBox(
        "Access",
        `Deleted!`,
        `
        User has been
        successfully deleted.`,
        () => {},
        () => {},
        true,
        () => {
          setOpen(false);
          setShowDialog(false);
        },
        "",
        "",
        "",
        false,
        false,
        <UserDeleteIcon />,
      );
      setShowDialog(true);
      fetchData({ status: getActiveTabText() });
    } else {
      showDialogBox(
        "Access delete",
        `Error!`,
        `${userDetails?.name || userDetails?.email} could not be
        successfully deleted. Please try again later.`,
        () => {},
        () => {},
        true,
        () => {
          setOpen(false);
          setShowDialog(false);
        },
        "",
        "",
        "",
        false,
        false,
        <UserSuspendIcon />,
      );
      setShowDialog(true);
    }
  };

  const deleteMultiple = async () => {
    let res = await deleteMultipleUsers();
    if (res?.deleteManyUsers) {
      showDialogBox(
        "Users",
        `Deleted!`,
        `Users hav been
        successfully deleted.`,
        () => {},
        () => {},
        true,
        () => {
          setOpen(false);
          setShowDialog(false);
        },
        "",
        "",
        "",
        false,
        false,
        <UserDeleteIcon />,
      );
      setShowDialog(true);
      fetchData({ status: getActiveTabText() });
    } else {
      showDialogBox(
        "Deletion",
        `Erro!`,
        `Users could not be deleted successfully, please try again later.`,
        () => {},
        () => {},
        true,
        () => {
          setOpen(false);
          setShowDialog(false);
        },
        "",
        "",
        "",
        false,
        false,
        <UserDeleteIcon />,
      );
      setShowDialog(true);
    }
  };

  const reInviteUserFunc = async (userInfoParam?: any) => {
    let userInfo = userInfoParam || userDetails || getUserInfo(selectedUser);

    if (!userInfo) {
      showDialogBox(
        "Re invite",
        `Error!`,
        `User details not found. Please try again.`,
        () => {},
        () => {},
        true,
        () => {
          setOpen(false);
          setShowDialog(false);
        },
        "",
        "",
        "",
        false,
        false,
        <UserUpdateIcon />,
      );
      setShowDialog(true);
      return;
    }

    try {
      let res = await reInviteUser(selectedUser, userInfo);

      if (res?.inviteUsers === true) {
        // alert(status)
        showDialogBox(
          "Re Invite",
          `Successfull`,
          `User was successfully invited`,
          () => {},
          () => {},
          true,
          () => {
            setOpen(false);
            setShowDialog(false);
          },
          "",
          "",
          "",
          false,
          false,
          <UserUpdateIcon />,
        );
        setShowDialog(true);
        fetchData({ status: getActiveTabText() });
      } else {
        showDialogBox(
          "Re invite",
          `Error!`,
          `Invite could not be sent successfully. Please try again later.`,
          () => {},
          () => {},
          true,
          () => {
            setOpen(false);
            setShowDialog(false);
          },
          "",
          "",
          "",
          false,
          false,
          <UserUpdateIcon />,
        );
        setShowDialog(true);
      }
    } catch (error) {
      showDialogBox(
        "Re invite",
        `Error!`,
        `An error occurred: ${error instanceof Error ? error.message : "Please try again later."}`,
        () => {},
        () => {},
        true,
        () => {
          setOpen(false);
          setShowDialog(false);
        },
        "",
        "",
        "",
        false,
        false,
        <UserUpdateIcon />,
      );
      setShowDialog(true);
    }
  };

  const handleExport = () => {
    let data = tableData?.map((d: any) => ({
      "First Name": d.firstName,
      "Last Name": d.lastName,
      Projects: getProjectsName(d.projectList)?.toLocaleString(),
      Status: d.status,
      Email: d.email,
      "No. of Projects": d.numOfProjects,
      Role: d.role,
    }));
    exportFromJSON({
      data: data,
      fileName: "Users Export",
      exportType: exportFromJSON.types.csv,
    });
  };

  const handleAddMembers = () => {
    // return router.push("/user/add-user");
    return setAddMember(true);
  };

  const [usersSelected, setUsersSelected] = useState<Array<any>>();
  const [addMember, setAddMember] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearInterval(timeoutRef.current);
    if (usersSelected && usersSelected?.length > 0) {
      timeoutRef.current = setTimeout(() => setOpenBatchModal(true), 2000);
    } else {
      setOpenBatchModal(false);
    }
  }, [usersSelected]);

  const toggleTab = (value: number) => {
    setActiveTab(value);

    // Get the appropriate status based on tab
    const statusText =
      value === 0 ? "ACTIVE" : value === 1 ? "INACTIVE" : "INVITED";

    // Fetch users with both tab and location filters
    fetchData({
      status: statusText,
      location: selectedLocation || undefined,
    });
  };

  const ControlPanelDropdownData = [
    {
      id: 0,
      label: "Active",
      value: "",
      tabIndex: 0,
    },
    {
      id: 1,
      label: "Inactive",
      value: "",
      tabIndex: 1,
    },
    {
      id: 2,
      label: "Invited",
      value: "",
      tabIndex: 2,
    },
  ];

  useEffect(() => {
    updateUserPage({ selectedUsers: usersSelected });
  }, [usersSelected, updateUserPage]);

  return (
    <>
      <ControlPanel
        dropdownData={{
          defaultValue: activeTab.toString(),
          data: ControlPanelDropdownData.map((item) => ({
            ...item,
            value: item.tabIndex.toString(),
          })),
          setValue: (index: number) => {
            const selectedItem = ControlPanelDropdownData[index];
            if (selectedItem) {
              toggleTab(selectedItem.tabIndex);
            }
          },
        }}
        locationFilter={
          <div style={{ position: "relative" }}>
            <Button
              onClick={handleLocationFilterClick}
              disableRipple
              sx={{
                display: "flex",
                padding: "0.9rem 1.3rem",
                alignItems: "center",
                gap: "0.625rem",
                borderRadius: "0.9rem",
                border: "1px solid #c1c7ca",
                background: "#fff",
                cursor: "pointer",
                justifyContent: "center",
                textTransform: "none",
                color: "inherit",
                fontSize: "1rem",
                fontWeight: 500,
                lineHeight: "1.25rem",
                height: "3.375rem",
                boxShadow: "none",
                fontFamily: "Inter",
                minWidth: "150px",
                maxWidth: "170px",
                width: "auto",
                transition: "none",
                userSelect: "text",
                "&:hover": {
                  backgroundColor: "#fff",
                  boxShadow: "none",
                },
                "@media (max-width: 1024px) and (min-width: 769px)": {
                  height: "2.8rem",
                  padding: "0.7rem 1rem",
                  borderRadius: "0.7rem",
                  fontSize: "0.85rem",
                  minWidth: "140px",
                  maxWidth: "160px",
                },
                "@media (max-width: 768px)": {
                  height: "2.2rem",
                  padding: "0.3rem 0.5rem",
                  borderRadius: "0.4rem",
                  fontSize: "0.7rem",
                  minWidth: "130px",
                  maxWidth: "150px",
                },
              }}
              endIcon={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <KeyboardArrowDownIcon />
                </div>
              }
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "0.6rem",
                  fontSize: "1rem",
                  fontWeight: 400,
                  lineHeight: "1.25rem",
                  userSelect: "text",
                }}
              >
                <span style={{ userSelect: "text" }}>
                  {selectedLocation === ""
                    ? "All Team"
                    : locationOptions
                        .find((loc) => loc.value === selectedLocation)
                        ?.label.replace(" Team", "")
                        .replace(" (", "")
                        .split(")")[0] || "All Team"}
                </span>
              </div>
            </Button>
            <Menu
              anchorEl={locationFilterAnchorEl}
              open={Boolean(locationFilterAnchorEl)}
              onClose={handleLocationFilterClose}
              MenuListProps={{
                "aria-labelledby": "location-filter-button",
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: "4px",
                  marginTop: "3px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  minWidth: "150px",
                  width: "150px",
                  left: "5%",
                  "@media (max-width: 1024px) and (min-width: 769px)": {
                    minWidth: "145px",
                    width: "145px",
                    borderRadius: "3.5px",
                  },
                  "@media (max-width: 768px)": {
                    minWidth: "140px",
                    width: "140px",
                    borderRadius: "3px",
                  },
                },
                "& .MuiMenu-list": {
                  padding: "0",
                },
              }}
            >
              {memoizedLocationOptions.map((location) => (
                <MenuItem
                  key={location.id}
                  onClick={() => handleLocationFilterSelect(location.value)}
                  sx={{
                    padding: "8px",
                    fontSize: "1rem",
                    fontFamily: "Inter",
                    lineHeight: "1.25rem",
                    color: "inherit",
                    fontWeight: 500,
                    "&:hover": {
                      background: "rgba(0, 0, 0, 0.1)",
                    },
                    "@media (max-width: 1024px) and (min-width: 769px)": {
                      padding: "6px 8px",
                      fontSize: "0.85rem",
                      lineHeight: "1.1rem",
                      fontWeight: 500,
                    },
                    "@media (max-width: 768px)": {
                      padding: "4px 6px",
                      fontSize: "0.75rem",
                      lineHeight: "1rem",
                      fontWeight: 400,
                    },
                  }}
                >
                  {location.label}
                </MenuItem>
              ))}
            </Menu>
          </div>
        }
        searchBox={{
          placeholder: "Search User",
          searchBoxFunc: (value: any) => {
            setSearchInput(value);
          },
        }}
        actionBtns={[
          {
            actionBtnText: "Export List",
            actionBtnFunc: () => {
              handleExport();
            },
            actionBtnIcon: <UploadIcon />,
            actionBtnStyle: "secondary",
          },
          {
            actionBtnText: "Add Member",
            actionBtnFunc: () => {
              handleAddMembers();
            },
            actionBtnIcon: <AddIcon />,
          },
        ]}
      />

      <AnalyticsCardsContainer>
        <AnalyticsCard>
          <AnalyticsCardHeader>
            <AnalyticsCardTitle>Total Users</AnalyticsCardTitle>
            <AnalyticsIconWrapper style={{ backgroundColor: "#EEF4FF" }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </AnalyticsIconWrapper>
          </AnalyticsCardHeader>
          <AnalyticsCardValue>
            {appsLoading ? <Skeleton width="40%" /> : totalUsersCount}
          </AnalyticsCardValue>
        </AnalyticsCard>

        <AnalyticsCard>
          <AnalyticsCardHeader>
            <AnalyticsCardTitle>Active Users</AnalyticsCardTitle>
            <AnalyticsIconWrapper style={{ backgroundColor: "#ECFDF5" }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12L10.5 14.5L16 9"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </AnalyticsIconWrapper>
          </AnalyticsCardHeader>
          <AnalyticsCardValue>
            {appsLoading ? <Skeleton width="40%" /> : activeCount}
          </AnalyticsCardValue>
        </AnalyticsCard>

        <AnalyticsCard>
          <AnalyticsCardHeader>
            <AnalyticsCardTitle>Invited Users</AnalyticsCardTitle>
            <AnalyticsIconWrapper style={{ backgroundColor: "#FEF3C7" }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 11V7M20 9H26"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </AnalyticsIconWrapper>
          </AnalyticsCardHeader>
          <AnalyticsCardValue>
            {appsLoading ? <Skeleton width="40%" /> : invitedCount}
          </AnalyticsCardValue>
        </AnalyticsCard>

        <AnalyticsCard>
          <AnalyticsCardHeader>
            <AnalyticsCardTitle>Inactive Users</AnalyticsCardTitle>
            <AnalyticsIconWrapper style={{ backgroundColor: "#FEE2E2" }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </AnalyticsIconWrapper>
          </AnalyticsCardHeader>
          <AnalyticsCardValue>
            {appsLoading ? <Skeleton width="40%" /> : archivedCount}
          </AnalyticsCardValue>
        </AnalyticsCard>
        {/* 
        {pricingData?.apps
          ?.filter((app) => app.isActive)
          .map((app) => (
            <AnalyticsCard key={app._id}>
              <AnalyticsCardHeader>
                <AnalyticsCardTitle>{app.name} Users</AnalyticsCardTitle>
                <AnalyticsIconWrapper
                  style={{ backgroundColor: getAppIconBg(app.appId) }}
                >
                  {getAppIcon(app.appId)}
                </AnalyticsIconWrapper>
              </AnalyticsCardHeader>
              <AnalyticsCardValue>
                {appsLoading ? (
                  <Skeleton width="40%" />
                ) : (
                  `${appCounts[app.appId] || 0} / ${app.maxSeats || "∞"}`
                )}
              </AnalyticsCardValue>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "#6F6F76",
                  mt: 0.5,
                  fontWeight: 500,
                  opacity: 0.8,
                }}
              >
                Billed Seats Used
              </Typography>
            </AnalyticsCard>
          ))} */}
      </AnalyticsCardsContainer>

      <div style={{ padding: "1rem 0", width: "100%" }}>
        <UsersWrapper>
          {usersSelected && (
            <ExternalActionModal
              deleteBtn={() => {
                setOpenBatchModal(false);
                deleteMultiple();
              }}
              firstBtn={() => {
                setOpenBatchModal(false);
                suspendMultiple(activeTab === 0 ? "SUSPENDED" : "ACTIVE");
              }}
              firstBtnText={activeTab === 0 ? "Suspend" : "Unsuspend"}
              selected={usersSelected?.length || 0}
              unselectBtn={() => {
                setUsersSelected([]);
              }}
              handleClose={() => {
                setOpenBatchModal(false);
              }}
              open={openBatchModal}
              title="Users"
              showModal={false}
            />
          )}
          {addMember && (
            <AddMembersForm
              open={addMember}
              onClose={() => setAddMember(false)}
              existingUsage={appCounts}
            />
          )}
          <AppAccessModal
            open={openAppAccess}
            onClose={() => setOpenAppAccess(false)}
            clientId={selectedSeatId}
            currentAccess={currentAppAccess}
            onUpdate={() => fetchData({ status: getActiveTabText() })}
          />
          <DialogBox
            title="Assign Project"
            actionText="Update"
            handleClose={() => {
              setOpen(false);
              fetchData({ status: getActiveTabText() });
            }}
            open={open}
            selectedUser=""
            onUpdate={() => {
              showDialogBox(
                "Are you sure you want to",
                `Update Access for ${userDetails?.name || userDetails?.email}`,
                "Take a moment to confirm. Are you certain about updating all the changes in this list?",
                addUserToProject,
                setShowDialog,
                false,
                () => {
                  setOpen(false);
                  setShowDialog(false);
                },
                "Cancel",
                "Save Changes",
                "",
                false,
                false,
                <UserUpdateIcon />,
              );
              setShowDialog(true);
              setOpen(false);
            }}
          >
            <AssignProjectForm
              projects={userPageState.projects}
              setSelectedProjects={setSelectedProjects}
              selectedProjects={selectedProjects}
            />
          </DialogBox>
          <ConfirmDialogBox
            open={showDialog}
            close={() => setShowDialog(false)}
            mainMessage={
              <MainMessage>
                {dialogProps.mainText} {dialogProps.addNewLine && <NewLine />}
                <MainMessageBlue>{dialogProps.mainTextBlue}</MainMessageBlue>
                {dialogProps.questionMark ? "?" : ""}
              </MainMessage>
            }
            subMessage={<SubMessage>{dialogProps.subText}</SubMessage>}
            buttonCancelText={dialogProps.buttonCancelText}
            buttonAcceptText={dialogProps.buttonAcceptText}
            accept={() => {
              dialogProps.accept();
            }}
            cancel={() => dialogProps.cancel(false)}
            ok={dialogProps.ok}
            buttonOK={dialogProps.buttonOk}
            buttonAcceptColor={dialogProps.buttonAcceptColor}
            headerImgUrl={dialogProps.headerImgUrl}
          />{" "}
          <UserHeaderWrapper>
            <UserHeaderLeftSide>
              <h3>Users</h3>
              <span className="no_of_Users">{`${tableData.length} User${
                tableData.length > 1 ? "s" : ""
              }`}</span>
            </UserHeaderLeftSide>
            <div style={{ position: "relative" }}>
              <Button
                onClick={handleColumnMenuOpen}
                disableRipple
                sx={{
                  display: "flex",
                  padding: "0.6rem 1.2rem",
                  alignItems: "center",
                  gap: "0.5rem",
                  borderRadius: "0.6rem",
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  cursor: "pointer",
                  justifyContent: "center",
                  textTransform: "none",
                  color: "#374151",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  lineHeight: "1.25rem",
                  height: "2.5rem",
                  boxShadow: "none",
                  fontFamily: "Inter",
                  minWidth: "auto",
                  width: "auto",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#f9fafb",
                    borderColor: "#d1d5db",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  },
                  [theme.breakpoints.down("md")]: {
                    display: "none",
                  },
                }}
                startIcon={<ViewColumnsIcon sx={{ fontSize: "16px" }} />}
                endIcon={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <KeyboardArrowDownIcon />
                  </div>
                }
              >
                Columns
              </Button>
              <Menu
                anchorEl={columnMenuAnchorEl}
                open={Boolean(columnMenuAnchorEl)}
                onClose={handleColumnMenuClose}
                MenuListProps={{
                  "aria-labelledby": "column-filter-button",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: "8px",
                    marginTop: "4px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    minWidth: "200px",
                    maxHeight: "300px",
                    border: "1px solid #e5e7eb",
                  },
                  "& .MuiMenu-list": {
                    padding: "8px 0",
                  },
                }}
              >
                {getAvailableColumnsForMenu().map((column) => {
                  const isVisible = visibleColumns.includes(column.id);
                  return (
                    <MenuItem
                      key={column.id}
                      onClick={() => toggleColumn(column.id)}
                      sx={{
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontFamily: "Inter",
                        lineHeight: "20px",
                        color: "#374151",
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        "&:hover": {
                          background: "#f9fafb",
                        },
                      }}
                    >
                      {isVisible ? (
                        <CheckBoxIcon
                          sx={{ fontSize: "18px", color: "#4f46e5" }}
                        />
                      ) : (
                        <CheckBoxOutlineBlankIcon
                          sx={{ fontSize: "18px", color: "#9ca3af" }}
                        />
                      )}
                      {column.name}
                    </MenuItem>
                  );
                })}
              </Menu>
            </div>
          </UserHeaderWrapper>
          {showCardLayout ? (
            <UserCardsContainer>
              {tableData.map((user: any) => {
                const isSelected = usersSelected?.some(
                  (u: any) => u?.id === user?.id,
                );
                const hideInvite = activeTab !== 2;
                const hideSuspend = activeTab !== 0;
                const hideActive =
                  activeTab !== 1 || user.status?.toLowerCase() === "deleted";
                const hideEdit = activeTab === 1;
                const hideAddProject = activeTab === 1;

                return (
                  <UserCard key={user.id}>
                    <UserCardHeader>
                      <UserCardCheckbox>
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUsersSelected([
                                ...(usersSelected || []),
                                user,
                              ]);
                            } else {
                              setUsersSelected(
                                usersSelected?.filter(
                                  (u: any) => u?.id !== user?.id,
                                ) || [],
                              );
                            }
                          }}
                        />
                      </UserCardCheckbox>
                      <UserCardAvatarSection
                        onClick={() =>
                          router.push(
                            `/user/add-user?sId=${user?.id}&view=${true}`,
                          )
                        }
                      >
                        <UserCardNameSection>
                          <UserCardName>{user.user?.name}</UserCardName>
                          <UserCardEmail>{user.email}</UserCardEmail>
                        </UserCardNameSection>
                      </UserCardAvatarSection>
                      <UserCardRoleBadge>{user.role}</UserCardRoleBadge>
                    </UserCardHeader>

                    <UserCardDetails>
                      <UserCardDetailItem>
                        <UserCardDetailLabel>PROJECTS</UserCardDetailLabel>
                        <UserCardDetailValue
                          onClick={() =>
                            handleChange("assignProjects", user.id)
                          }
                          style={{ cursor: "pointer", color: "#475CD8" }}
                        >
                          {user.numOfProjects}
                        </UserCardDetailValue>
                      </UserCardDetailItem>
                      <UserCardDetailItem>
                        <UserCardDetailLabel>DATE ADDED</UserCardDetailLabel>
                        <UserCardDetailValue>
                          {new Date(user.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          })}
                        </UserCardDetailValue>
                      </UserCardDetailItem>
                      <UserCardDetailItem>
                        <UserCardDetailLabel>STATUS</UserCardDetailLabel>
                        <UserCardStatusValue
                          status={user.status?.toLowerCase()}
                        >
                          {user.status}
                        </UserCardStatusValue>
                      </UserCardDetailItem>
                    </UserCardDetails>

                    <UserCardActions>
                      <UserCardActionLeft>
                        <Tooltip title="Edit">
                          <ActionBtn
                            hide={hideEdit}
                            onClick={() => handleChange("editUser", user.id)}
                          >
                            <EditBtnIcon width={18} height={18} />
                          </ActionBtn>
                        </Tooltip>
                        <Tooltip title="Assign Project">
                          <ActionBtn
                            hide={hideAddProject}
                            onClick={() =>
                              handleChange("assignProjects", user.id)
                            }
                          >
                            <PlusIcon width={18} height={18} />
                          </ActionBtn>
                        </Tooltip>
                        <Tooltip title="Suspend">
                          <ActionBtn
                            hide={hideSuspend}
                            onClick={() =>
                              handleChange("suspendAccess", user.id)
                            }
                          >
                            <SlashCircleIcon width={20} height={20} />
                          </ActionBtn>
                        </Tooltip>
                        <Tooltip title="Activate">
                          <ActionBtn
                            hide={hideActive}
                            onClick={() =>
                              handleChange("restoreAccess", user.id)
                            }
                          >
                            <ActiveIcon width={18} height={18} />
                          </ActionBtn>
                        </Tooltip>
                        <Tooltip title="Reinvite">
                          <ActionBtn
                            hide={hideInvite}
                            onClick={() => {
                              const userInfo = getUserInfo(user.id) || user;
                              handleChange("reInviteUser", user.id, userInfo);
                            }}
                          >
                            <InviteIcon width={18} height={18} />
                          </ActionBtn>
                        </Tooltip>
                      </UserCardActionLeft>
                      <Tooltip title="Delete">
                        <ActionBtn
                          onClick={() => handleChange("deleteUser", user.id)}
                        >
                          <DeleteBtnIcon width={18} height={18} />
                        </ActionBtn>
                      </Tooltip>
                    </UserCardActions>
                  </UserCard>
                );
              })}
            </UserCardsContainer>
          ) : (
            <UserTable>
              {appsLoading ? (
                <div style={{ padding: "1rem" }}>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      height={60}
                      sx={{
                        mb: "1px",
                        backgroundColor: "#f9fafb",
                        borderRadius: i === 0 ? "8px 8px 0 0" : "0",
                      }}
                    />
                  ))}
                </div>
              ) : (
                <CustomTable
                  key={activeTab}
                  onSelect={(e: any) => {
                    setUsersSelected(e);
                  }}
                  onClick={(row: any) => {
                    router.push(`/user/add-user?sId=${row.id}&view=${true}`);
                  }}
                  columns={columns}
                  data={tableData}
                  selectedRows={usersSelected}
                />
              )}
            </UserTable>
          )}
        </UsersWrapper>
      </div>
    </>
  );
};

export default Users;

const UsersWrapper = styled("div")(({ theme }) => ({
  borderRadius: "8px",
  background: "#fff",
  flex: 1,
  border: "1px solid #eaecf0",
  marginTop: "2rem",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    marginTop: "1rem",
    borderRadius: "8px",
  },
  paddingLeft: 0,
  paddingRight: 0,
}));

const UserNameWrapper = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  color: #1d2939;
  font-size: 0.875rem;
  line-height: 1.125rem;
  cursor: pointer;
`;

const UserTable = styled("div")`
  flex: 1;
`;

const ActionBtn = styled("button")<{ hide?: boolean }>(
  ({ hide = false, theme }) => ({
    all: "unset",
    display: hide ? "none" : "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2.5rem",
    cursor: "pointer",
    height: "2.5rem",
    "& > img": {
      width: "60%",
    },
    [theme.breakpoints.down("md")]: {
      width: "2.25rem",
      height: "2.25rem",
    },
  }),
);

const UserHeaderWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1.5rem 1.2rem",
  flexWrap: "wrap",
  gap: "1rem",
  [theme.breakpoints.down("md")]: {
    padding: "1rem 0.75rem",
    gap: "0.75rem",
  },
}));

const UserHeaderLeftSide = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  flex: 1,
  minWidth: 0,
  "> h3": {
    color: "#101828",
    fontSize: "1.125rem",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "1.75rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "1rem",
      lineHeight: "1.5rem",
    },
  },
  "> .no_of_Users": {
    borderRadius: "1rem",
    border: "1px solid #50589f",
    background: "#eef0ff",
    mixBlendMode: "multiply",
    fontSize: "0.76rem",
    lineHeight: "1.15rem",
    fontWeight: 500,
    color: "#50589f",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    whiteSpace: "nowrap",
    [theme.breakpoints.down("md")]: {
      fontSize: "0.7rem",
      paddingLeft: "0.4rem",
      paddingRight: "0.4rem",
    },
  },
}));

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} placement={"right"} />
))(({ theme }) => ({
  cursor: "pointer",
  [`& .${tooltipClasses.tooltipArrow}`]: {
    backgroundColor: "#244BB6",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#244BB6",
    color: "rgba(0, 0, 0, 0.87)",
    // maxWidth: 220,
    // fontSize: theme.typography.pxToRem(12),
    // border: "1px solid #dadde9",
  },
}));

const TableCellTextBlue = styled(Box)<ITableCellTextBlue>(
  ({ theme, addMarginLeft, marginLeftValue }) => ({
    color: "#475CD8",
    fontSize: "1.4rem",
    lineHeight: "2.0rem",
    fontWeight: 500,
    // width:"10%",
    display: "inline",
    // textAlign: "center",
    marginLeft: addMarginLeft
      ? marginLeftValue
        ? marginLeftValue
        : "0.8rem"
      : undefined,
    marginRight: "1rem",
  }),
);

// Mobile/Tablet Card Layout Styles
const UserCardsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "1rem",
  [theme.breakpoints.down("md")]: {
    padding: "0.75rem",
    gap: "0.75rem",
  },
}));

const UserCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: "8px",
  border: "1px solid #EAECF0",
  padding: "1.25rem",
  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  [theme.breakpoints.down("md")]: {
    padding: "1rem",
    gap: "0.875rem",
  },
}));

const UserCardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  position: "relative",
  [theme.breakpoints.down("md")]: {
    gap: "0.625rem",
  },
}));

const UserCardCheckbox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const UserCardAvatarSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  flex: 1,
  cursor: "pointer",
  minWidth: 0,
  [theme.breakpoints.down("md")]: {
    gap: "0.625rem",
  },
}));

const UserCardNameSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  minWidth: 0,
  flex: 1,
}));

const UserCardName = styled(Typography)(({ theme }) => ({
  color: "#1D2939",
  fontSize: "0.875rem",
  fontWeight: 600,
  lineHeight: "1.25rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  [theme.breakpoints.down("md")]: {
    fontSize: "0.8125rem",
  },
}));

const UserCardEmail = styled(Typography)(({ theme }) => ({
  color: "#6B7280",
  fontSize: "0.75rem",
  lineHeight: "1rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  [theme.breakpoints.down("md")]: {
    fontSize: "0.6875rem",
  },
}));

const UserCardRoleBadge = styled(Box)(({ theme }) => ({
  backgroundColor: "#EEF0FF",
  color: "#50589F",
  padding: "0.25rem 0.75rem",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: 500,
  textTransform: "uppercase",
  flexShrink: 0,
  [theme.breakpoints.down("md")]: {
    fontSize: "0.6875rem",
    padding: "0.2rem 0.625rem",
  },
}));

const UserCardDetails = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "1rem 1.5rem",
  paddingTop: "0.75rem",
  borderTop: "1px solid #EAECF0",
  [theme.breakpoints.down("md")]: {
    gap: "0.75rem 1rem",
    paddingTop: "0.625rem",
  },
}));

const UserCardDetailItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
}));

const UserCardDetailLabel = styled(Typography)(({ theme }) => ({
  color: "#6B7280",
  fontSize: "0.75rem",
  fontWeight: 500,
  lineHeight: "1rem",
  [theme.breakpoints.down("md")]: {
    fontSize: "0.6875rem",
  },
}));

const UserCardDetailValue = styled(Typography)(({ theme }) => ({
  color: "#111827",
  fontSize: "0.875rem",
  fontWeight: 500,
  lineHeight: "1.25rem",
  [theme.breakpoints.down("md")]: {
    fontSize: "0.8125rem",
  },
}));

const UserCardStatusValue = styled(Typography)<{ status?: string }>(
  ({ theme, status }) => ({
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: "1.25rem",
    color:
      status === "active"
        ? "#10B981"
        : status === "inactive"
          ? "#6B7280"
          : "#6B7280",
    [theme.breakpoints.down("md")]: {
      fontSize: "0.8125rem",
    },
  }),
);

const UserCardActions = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: "0.75rem",
  borderTop: "1px solid #EAECF0",
  [theme.breakpoints.down("md")]: {
    paddingTop: "0.625rem",
  },
}));

const UserCardActionLeft = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  [theme.breakpoints.down("md")]: {
    gap: "0.375rem",
  },
}));

// Analytics Cards Styles
const AnalyticsCardsContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: "1rem",
  padding: "2.5rem 0rem 0rem ",
  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
  },
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
    padding: "1.5rem 0",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

const AnalyticsCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  border: "1px solid #E2E8F0",
  padding: "1.25rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.08)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)",
  },
  [theme.breakpoints.down("md")]: {
    padding: "1rem",
  },
}));

const AnalyticsCardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const AnalyticsCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#6B7280",
  lineHeight: "1.25rem",
  [theme.breakpoints.down("md")]: {
    fontSize: "0.8125rem",
  },
}));

const AnalyticsIconWrapper = styled(Box)(({ theme }) => ({
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

const AnalyticsCardValue = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: 600,
  color: "#111827",
  lineHeight: "2.5rem",
  [theme.breakpoints.down("md")]: {
    fontSize: "1.75rem",
    lineHeight: "2.25rem",
  },
}));

const AnalyticsIndicatorContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "0.375rem",
  alignItems: "center",
}));

interface AnalyticsIndicatorProps {
  active: boolean;
  color: string;
}

const AnalyticsIndicator = styled(Box)<AnalyticsIndicatorProps>(
  ({ theme, active, color }) => ({
    height: "6px",
    flex: 1,
    borderRadius: "3px",
    backgroundColor: active ? color : "#E5E7EB",
    transition: "background-color 0.3s ease",
  }),
);

const AppAccessModal = ({
  open,
  onClose,
  clientId,
  currentAccess,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  clientId: string;
  currentAccess: string[];
  onUpdate: () => void;
}) => {
  const [selectedApps, setSelectedApps] = useState<string[]>(currentAccess);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setSelectedApps(currentAccess);
  }, [currentAccess, open]);

  const handleToggle = (app: string) => {
    setSelectedApps((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app],
    );
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      await axios.patch(
        `${apiUrl}/api/admin/users/${clientId}/apps`,
        {
          appAccess: selectedApps,
        },
        { withCredentials: true },
      );
      notifySuccessFxn("App access updated successfully");
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error(error);
      notifyErrorFxn(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update app access",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DialogBox
      open={open}
      handleClose={onClose}
      title="Manage App Access"
      actionText="Save Changes"
      onUpdate={handleSave}
      selectedUser={clientId}
      isLoading={isUpdating}
    >
      <div style={{ padding: "0.5rem" }}>
        <div
          style={{ marginBottom: "1rem", fontSize: "14px", color: "#667085" }}
        >
          Select the apps this user should have access to.
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          {["Tracker", "Sales", "Recruit", "Market"].map((app) => (
            <FormControlLabel
              key={app}
              control={
                <Checkbox
                  size="small"
                  checked={selectedApps.includes(app.toLowerCase())}
                  onChange={() => handleToggle(app.toLowerCase())}
                />
              }
              label={<span style={{ fontSize: "14px" }}>{app}</span>}
            />
          ))}
        </div>
      </div>
    </DialogBox>
  );
};
