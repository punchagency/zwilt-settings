"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import axios from "@/config/axiosConfig";
import { apiUrl } from "@/config/apiUrl";
import { GET_USER_BY_ID } from "@/graphql/queries/auth";
import {
  UPDATE_MEMBER_INFO,
  UPDATE_SEAT_APP_ACCESS,
  SUSPEND_SEAT,
  REACTIVATE_SEAT,
  DELETE_MEMBER_FROM_ORGANIZATION,
} from "@/graphql/mutations/manageTeam";
import { notifyErrorFxn, notifySuccessFxn } from "@/utils/toast-fxn";
import AvatarP from "@/components/avatar";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Skeleton,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/PersonRemove";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const FALLBACK_APPS = [
  { id: "tracker", label: "Tracker" },
  { id: "recruit", label: "Recruit" },
];

const Page = styled(Box)({
  fontFamily: "Switzer",
  padding: "1.5rem 2rem",
  color: "#282833",
  maxWidth: 960,
  margin: "0 auto",
});

const Card = styled(Box)({
  background: "#fff",
  border: "1px solid #ECECF1",
  borderRadius: 12,
  padding: "1.5rem",
});

const Label = styled(Typography)({
  fontFamily: "Switzer",
  fontSize: 12,
  fontWeight: 500,
  color: "#86868E",
  marginBottom: 4,
});

const Value = styled(Typography)({
  fontFamily: "Switzer",
  fontSize: 14,
  fontWeight: 500,
  color: "#282833",
});

const SectionTitle = styled(Typography)({
  fontFamily: "Switzer",
  fontWeight: 600,
  fontSize: 16,
  color: "#282833",
});

const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const roleLabel = (role?: string) =>
  ({
    ORGANIZATION_OWNER: "Organisation owner",
    ORGANIZATION_MANAGER: "Organisation manager",
    PROJECT_MANAGER: "Project manager",
    USER: "User",
    VIEW: "Viewer",
  })[role || ""] ||
  role ||
  "—";

const statusColor = (status?: string) => {
  switch ((status || "").toUpperCase()) {
    case "ACTIVE":
      return { bg: "#E7F6EC", fg: "#1F9254" };
    case "SUSPENDED":
    case "DEACTIVATED":
    case "REMOVED":
      return { bg: "#FBEAEA", fg: "#C7271C" };
    case "INVITED":
      return { bg: "#FFF4E5", fg: "#B26A00" };
    default:
      return { bg: "#EEF0F4", fg: "#5A5A66" };
  }
};

const StatusChip = ({ status }: { status?: string }) => {
  const c = statusColor(status);
  return (
    <Chip
      label={status || "—"}
      size="small"
      sx={{
        fontFamily: "Switzer",
        fontWeight: 600,
        fontSize: 11,
        height: 22,
        background: c.bg,
        color: c.fg,
      }}
    />
  );
};

const Field = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <Box sx={{ minWidth: 180 }}>
    <Label>{label}</Label>
    <Value>{value === "" || value == null ? "—" : value}</Value>
  </Box>
);

const Input = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
  type?: string;
}) => (
  <TextField
    label={label}
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    type={type}
    size="small"
    InputLabelProps={type === "date" ? { shrink: true } : undefined}
    sx={{ minWidth: 200, flex: "1 1 200px", fontFamily: "Switzer" }}
  />
);

const ProfilePage = () => {
  const router = useRouter();
  const { sId } = router.query;
  const userId = typeof sId === "string" ? sId : "";

  const { data, loading, error, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
    skip: !router.isReady || !userId,
    fetchPolicy: "cache-and-network",
  });

  const user = data?.getUserById?.data;
  const notFound = !loading && router.isReady && (!userId || (data && !user));

  // ── available apps (for the access editor) ──
  const [appOptions, setAppOptions] =
    useState<{ id: string; label: string }[]>(FALLBACK_APPS);
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/admin/pricing`, { withCredentials: true })
      .then((res) => {
        const apps = res?.data?.data?.apps;
        if (Array.isArray(apps) && apps.length) {
          setAppOptions(
            apps
              .filter((a: any) => a.isActive)
              .map((a: any) => ({ id: a.appId, label: a.name })),
          );
        }
      })
      .catch(() => setAppOptions(FALLBACK_APPS));
  }, []);

  // ── HR / details editing ──
  const [editingInfo, setEditingInfo] = useState(false);
  const [form, setForm] = useState<any>({});
  const startEdit = () => {
    setForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      secondaryEmail: user?.secondaryEmail || "",
      dob: user?.dob || "",
      gender: user?.gender || "",
      jobTitle: user?.jobTitle || "",
      department: user?.department || "",
      employeeId: user?.employeeId || "",
      employmentType: user?.employmentType || "",
      startDate: user?.startDate || "",
      probationPeriod: user?.probationPeriod ?? "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      country: user?.address?.country || "",
      zipCode: user?.address?.zipCode || "",
    });
    setEditingInfo(true);
  };
  const setField = (k: string) => (v: string) =>
    setForm((f: any) => ({ ...f, [k]: v }));

  const [updateInfo, { loading: savingInfo }] = useMutation(UPDATE_MEMBER_INFO, {
    onCompleted: () => {
      notifySuccessFxn("Details updated");
      setEditingInfo(false);
      refetch();
    },
    onError: (e) => notifyErrorFxn(e?.message || "Failed to update details"),
  });

  const saveInfo = () => {
    if (!user) return;
    const { street, city, country, zipCode, probationPeriod, ...rest } = form;
    updateInfo({
      variables: {
        input: {
          memberId: user._id,
          ...rest,
          probationPeriod:
            probationPeriod === "" || probationPeriod == null
              ? undefined
              : Number(probationPeriod),
          address: { street, city, country, zipCode },
        },
      },
    });
  };

  // ── access editing ──
  const [editingAccess, setEditingAccess] = useState(false);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  useEffect(() => {
    if (user?.appAccess) setSelectedApps(user.appAccess);
  }, [user?.appAccess]);

  const [updateAccess, { loading: savingAccess }] = useMutation(
    UPDATE_SEAT_APP_ACCESS,
    {
      onCompleted: () => {
        notifySuccessFxn("App access updated");
        setEditingAccess(false);
        refetch();
      },
      onError: (e) => notifyErrorFxn(e?.message || "Failed to update access"),
    },
  );

  const [suspendSeat, { loading: suspending }] = useMutation(SUSPEND_SEAT, {
    onCompleted: () => {
      notifySuccessFxn("Access suspended");
      refetch();
    },
    onError: (e) => notifyErrorFxn(e?.message || "Failed to suspend"),
  });

  const [reactivateSeat, { loading: reactivating }] = useMutation(
    REACTIVATE_SEAT,
    {
      onCompleted: () => {
        notifySuccessFxn("Access restored");
        refetch();
      },
      onError: (e) => notifyErrorFxn(e?.message || "Failed to reactivate"),
    },
  );

  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeMember, { loading: removing }] = useMutation(
    DELETE_MEMBER_FROM_ORGANIZATION,
    {
      onCompleted: () => {
        notifySuccessFxn("Member removed from organization");
        setRemoveOpen(false);
        router.push("/user-management");
      },
      onError: (e) => notifyErrorFxn(e?.message || "Failed to remove member"),
    },
  );

  const toggleApp = (id: string) =>
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );

  const fullName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Unknown user";
  const initials = (
    (user?.firstName?.[0] || user?.name?.[0] || user?.email?.[0] || "?") +
    (user?.lastName?.[0] || "")
  ).toUpperCase();
  const isSuspended = (user?.seatStatus || "").toUpperCase() !== "ACTIVE";
  const addr = user?.address;
  const addrStr = addr
    ? [addr.street, addr.city, addr.country, addr.zipCode]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <Page>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
        flexWrap="wrap"
        gap={1}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ fontFamily: "Switzer", textTransform: "none", color: "#282833" }}
        >
          Back
        </Button>

        {user && (
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            {!editingInfo && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={startEdit}
                sx={btnSx("#244BB6")}
              >
                Edit info
              </Button>
            )}
            <Button
              variant="outlined"
              disabled={suspending || reactivating}
              startIcon={isSuspended ? <CheckCircleIcon /> : <BlockIcon />}
              onClick={() =>
                isSuspended
                  ? reactivateSeat({ variables: { clientId: user._id } })
                  : suspendSeat({ variables: { clientId: user._id } })
              }
              sx={btnSx(isSuspended ? "#1F9254" : "#B26A00")}
            >
              {isSuspended ? "Restore access" : "Suspend access"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => setRemoveOpen(true)}
              sx={btnSx("#C7271C")}
            >
              Remove
            </Button>
          </Stack>
        )}
      </Stack>

      {loading && !user ? (
        <Card>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={80} height={80} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="40%" height={28} />
              <Skeleton width="30%" height={20} />
            </Box>
          </Stack>
          <Skeleton width="100%" height={120} sx={{ mt: 2 }} />
        </Card>
      ) : error || notFound ? (
        <Card>
          <Typography sx={{ fontFamily: "Switzer", color: "#C7271C" }}>
            {error?.message ||
              data?.getUserById?.message ||
              "User not found in your organization."}
          </Typography>
        </Card>
      ) : user ? (
        <Stack spacing={2}>
          {/* Identity header */}
          <Card>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <AvatarP
                img={user.profileImg}
                initial={initials}
                width="5rem"
                height="5rem"
              />
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography
                    sx={{
                      fontFamily: "Switzer",
                      fontWeight: 600,
                      fontSize: 22,
                      color: "#282833",
                    }}
                  >
                    {fullName}
                  </Typography>
                  <StatusChip status={user.status} />
                </Stack>
                <Typography
                  sx={{
                    fontFamily: "Switzer",
                    fontSize: 14,
                    color: "#86868E",
                    mt: 0.5,
                  }}
                >
                  {user.email}
                </Typography>
                {addrStr && !editingInfo && (
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    sx={{ mt: 0.5, color: "#86868E" }}
                  >
                    <LocationOnIcon sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontFamily: "Switzer", fontSize: 13 }}>
                      {addrStr}
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              <Field label="Role" value={roleLabel(user.role)} />
              <Field label="Organization" value={user.organizationName} />
              <Field label="Member since" value={formatDate(user.createdAt)} />
            </Box>
          </Card>

          {/* Personal */}
          <Card>
            <SectionTitle sx={{ mb: 2 }}>Personal</SectionTitle>
            {!editingInfo ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Field label="First name" value={user.firstName} />
                <Field label="Last name" value={user.lastName} />
                <Field label="Phone" value={user.phone} />
                <Field label="Secondary email" value={user.secondaryEmail} />
                <Field label="Date of birth" value={user.dob} />
                <Field label="Gender" value={user.gender} />
                <Field label="Address" value={addrStr} />
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Input label="First name" value={form.firstName} onChange={setField("firstName")} />
                <Input label="Last name" value={form.lastName} onChange={setField("lastName")} />
                <Input label="Phone" value={form.phone} onChange={setField("phone")} />
                <Input label="Secondary email" value={form.secondaryEmail} onChange={setField("secondaryEmail")} />
                <Input label="Date of birth" value={form.dob} onChange={setField("dob")} type="date" />
                <Input label="Gender" value={form.gender} onChange={setField("gender")} />
                <Input label="Street" value={form.street} onChange={setField("street")} />
                <Input label="City" value={form.city} onChange={setField("city")} />
                <Input label="Country" value={form.country} onChange={setField("country")} />
                <Input label="Zip code" value={form.zipCode} onChange={setField("zipCode")} />
              </Box>
            )}
          </Card>

          {/* Employment */}
          <Card>
            <SectionTitle sx={{ mb: 2 }}>Employment</SectionTitle>
            {!editingInfo ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Field label="Job title" value={user.jobTitle} />
                <Field label="Department" value={user.department} />
                <Field label="Employee ID" value={user.employeeId} />
                <Field label="Employment type" value={user.employmentType} />
                <Field label="Start date" value={user.startDate} />
                <Field
                  label="Probation (months)"
                  value={user.probationPeriod}
                />
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Input label="Job title" value={form.jobTitle} onChange={setField("jobTitle")} />
                <Input label="Department" value={form.department} onChange={setField("department")} />
                <Input label="Employee ID" value={form.employeeId} onChange={setField("employeeId")} />
                <Input label="Employment type" value={form.employmentType} onChange={setField("employmentType")} />
                <Input label="Start date" value={form.startDate} onChange={setField("startDate")} type="date" />
                <Input label="Probation (months)" value={form.probationPeriod} onChange={setField("probationPeriod")} type="number" />
              </Box>
            )}

            {editingInfo && (
              <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  disabled={savingInfo}
                  startIcon={
                    savingInfo ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : undefined
                  }
                  onClick={saveInfo}
                  sx={{ fontFamily: "Switzer", textTransform: "none", background: "#244BB6" }}
                >
                  Save details
                </Button>
                <Button
                  onClick={() => setEditingInfo(false)}
                  sx={{ fontFamily: "Switzer", textTransform: "none", color: "#86868E" }}
                >
                  Cancel
                </Button>
              </Stack>
            )}
          </Card>

          {/* Leave (read-only, mirrored from Tracker) */}
          <Card>
            <SectionTitle sx={{ mb: 2 }}>Leave</SectionTitle>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              <Field
                label="Annual leave balance"
                value={
                  user.annualLeaveBalance == null
                    ? "—"
                    : `${user.annualLeaveBalance} days`
                }
              />
              <Field
                label="Available leave"
                value={
                  user.availableLeave == null
                    ? "—"
                    : `${user.availableLeave} days`
                }
              />
            </Box>
            <Typography
              sx={{ fontFamily: "Switzer", fontSize: 12, color: "#86868E", mt: 1 }}
            >
              Leave is managed in the Tracker app (read-only here).
            </Typography>
          </Card>

          {/* App access (org-scoped seat) */}
          <Card>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <SectionTitle>App access</SectionTitle>
              <Stack direction="row" spacing={1} alignItems="center">
                <StatusChip status={user.seatStatus} />
                {!editingAccess ? (
                  <Button
                    size="small"
                    startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                    onClick={() => setEditingAccess(true)}
                    sx={{
                      fontFamily: "Switzer",
                      textTransform: "none",
                      color: "#244BB6",
                    }}
                  >
                    Edit access
                  </Button>
                ) : null}
              </Stack>
            </Stack>

            {!editingAccess ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {user.appAccess && user.appAccess.length > 0 ? (
                  user.appAccess.map((app: string) => (
                    <Chip
                      key={app}
                      label={app}
                      size="small"
                      sx={{
                        fontFamily: "Switzer",
                        fontSize: 11,
                        height: 22,
                        background: "#EEF2FB",
                        color: "#244BB6",
                        textTransform: "capitalize",
                      }}
                    />
                  ))
                ) : (
                  <Typography
                    sx={{
                      fontFamily: "Switzer",
                      fontSize: 13,
                      color: "#86868E",
                    }}
                  >
                    No app access
                  </Typography>
                )}
              </Stack>
            ) : (
              <Box>
                <Stack>
                  {appOptions.map((app) => (
                    <FormControlLabel
                      key={app.id}
                      control={
                        <Checkbox
                          checked={selectedApps.includes(app.id)}
                          onChange={() => toggleApp(app.id)}
                          sx={{ color: "#244BB6", "&.Mui-checked": { color: "#244BB6" } }}
                        />
                      }
                      label={
                        <Typography sx={{ fontFamily: "Switzer", fontSize: 14 }}>
                          {app.label}
                        </Typography>
                      }
                    />
                  ))}
                </Stack>
                <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
                  <Button
                    variant="contained"
                    disabled={savingAccess}
                    startIcon={
                      savingAccess ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : undefined
                    }
                    onClick={() =>
                      updateAccess({
                        variables: {
                          clientId: user._id,
                          appAccess: selectedApps,
                        },
                      })
                    }
                    sx={{
                      fontFamily: "Switzer",
                      textTransform: "none",
                      background: "#244BB6",
                    }}
                  >
                    Save access
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingAccess(false);
                      setSelectedApps(user.appAccess || []);
                    }}
                    sx={{
                      fontFamily: "Switzer",
                      textTransform: "none",
                      color: "#86868E",
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            )}
          </Card>
        </Stack>
      ) : null}

      {/* Remove confirmation */}
      <Dialog open={removeOpen} onClose={() => setRemoveOpen(false)}>
        <DialogTitle sx={{ fontFamily: "Switzer", fontWeight: 600 }}>
          Remove member
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: "Switzer", fontSize: 14 }}>
            Remove <b>{fullName}</b> from your organization? This revokes their
            access and frees the seat. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setRemoveOpen(false)}
            sx={{ fontFamily: "Switzer", textTransform: "none", color: "#86868E" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={removing}
            startIcon={
              removing ? <CircularProgress size={16} color="inherit" /> : undefined
            }
            onClick={() =>
              user && removeMember({ variables: { memberId: user._id } })
            }
            sx={{ fontFamily: "Switzer", textTransform: "none", background: "#C7271C" }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

const btnSx = (color: string) => ({
  fontFamily: "Switzer",
  textTransform: "none" as const,
  borderColor: color,
  color,
});

ProfilePage.requireAuth = true;

export default ProfilePage;
