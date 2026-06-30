import React, { useEffect, useState } from "react";
import Modal from "../modal";
import { styled } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Formik } from "formik";
import { useMutation } from "@apollo/react-hooks";
import { useRecoilValue } from "recoil";
import axios from "@/config/axiosConfig";
import { apiUrl } from "@/config/apiUrl";
import Input from "../common/input";
import userAtom from "@/atoms/user-atom";
import useLocationOptions from "@/hooks/team/use-location-options";
import { INVITE_USER } from "@/graphql/mutations/manageTeam";
import { notifyErrorFxn, notifySuccessFxn } from "@/utils/toast-fxn";
import {
  Role,
  UserTitle,
  generateInviteUserPayLoad,
  initialValues,
  validationSchema,
} from "../user/add-user/formHelper";

interface NewProjectModalT {
  handleClose: () => void;
  open: boolean;
  action: "create" | "edit" | "delete" | "archive" | "unarchive" | undefined;
  selectedProject?: any;
  onComplete: () => void;
}

interface AppOption {
  id: string;
  label: string;
}

// Fallback used only if the managed-app registry can't be fetched, so the
// form is always selectable.
const FALLBACK_APP_OPTIONS: AppOption[] = [
  { id: "tracker", label: "Tracker" },
  { id: "recruit", label: "Recruit" },
  { id: "sales", label: "Sales" },
  { id: "market", label: "Market" },
];

const AddMemberModal: React.FC<NewProjectModalT> = ({
  handleClose,
  open,
  onComplete,
}) => {
  const user = useRecoilValue(userAtom);
  const attachedOrganizationId = user?.userData?.attachedOrganization?._id;
  const { locationOptions, teams, loading: locationsLoading } =
    useLocationOptions();

  // The team selector is keyed by the Team entity _id (unique) so the selection is
  // unambiguous. The location string is derived from the chosen team for the
  // member's display/label field.
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const teamOptions = (teams || []).map((t: any) => ({
    label: t?.name || t?.location || "",
    value: String(t?._id || ""),
  }));

  const [appOptions, setAppOptions] = useState<AppOption[]>(FALLBACK_APP_OPTIONS);
  const [appsLoading, setAppsLoading] = useState(true);

  useEffect(() => {
    setAppsLoading(true);
    axios
      .get(`${apiUrl}/api/admin/pricing`)
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
      .catch((err) => console.error("Failed to fetch app registry:", err))
      .finally(() => setAppsLoading(false));
  }, []);

  const close = () => {
    handleClose();
    onComplete();
  };

  const [inviteUser, { loading }] = useMutation(INVITE_USER, {
    onCompleted: (data) => {
      if (data?.inviteUser !== undefined) {
        notifySuccessFxn("Invite sent successfully");
        close();
      }
    },
    onError: (error) => {
      console.error("Invite user mutation error:", error);
      if (
        error?.message?.includes("E11000") ||
        error?.message?.includes("duplicate key")
      ) {
        notifyErrorFxn(
          "This email address is already registered. Please use a different email.",
        );
      } else {
        notifyErrorFxn(error?.message || "Failed to send invite");
      }
    },
  });

  return (
    <Modal
      handleClose={close}
      open={open}
      borderRadius="15px"
      title={"Add Members"}
      width="30rem"
      height="auto"
    >
      <NewProjectModalContent>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            if (!attachedOrganizationId) {
              notifyErrorFxn("No organization found for your account.");
              return;
            }
            await inviteUser({
              variables: {
                input: {
                  ...generateInviteUserPayLoad({
                    ...values,
                    attachedOrganizationId,
                  }),
                  teamId: selectedTeamId,
                  projectIds: [],
                },
              },
            });
          }}
        >
          {({
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
            errors,
            values,
            setFieldValue,
          }) => (
            <>
              <FormWrapper>
                <FormSectionHeader>Member Details</FormSectionHeader>

                <Input
                  required
                  options={UserTitle}
                  value={values.title}
                  type="select"
                  label="Title"
                  placeholder="Choose Title"
                  error={touched.title && errors.title ? `${errors.title}` : ""}
                  onChange={handleChange("title")}
                  onBlur={handleBlur("title")}
                />
                <Input
                  required
                  label="First Name"
                  placeholder="Enter First Name"
                  value={values.firstName}
                  error={
                    touched.firstName && errors.firstName
                      ? `${errors.firstName}`
                      : ""
                  }
                  onChange={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                />
                <Input
                  required
                  label="Last Name"
                  placeholder="Enter Last Name"
                  value={values.lastName}
                  error={
                    touched.lastName && errors.lastName
                      ? `${errors.lastName}`
                      : ""
                  }
                  onChange={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                />
                <Input
                  required
                  label="Official Email"
                  placeholder="member@company.com"
                  value={values.email}
                  error={touched.email && errors.email ? `${errors.email}` : ""}
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
                <Input
                  required
                  options={Role}
                  type="select"
                  label="Assigned Role"
                  placeholder="Select Role"
                  value={values.assignedRole}
                  error={
                    touched.assignedRole && errors.assignedRole
                      ? `${errors.assignedRole}`
                      : ""
                  }
                  onChange={handleChange("assignedRole")}
                  onBlur={handleBlur("assignedRole")}
                />
                <Input
                  required
                  options={teamOptions}
                  type="select"
                  label="Team"
                  placeholder={
                    locationsLoading ? "Loading teams..." : "Select Team"
                  }
                  value={selectedTeamId}
                  error={
                    touched.location && errors.location
                      ? `${errors.location}`
                      : ""
                  }
                  onChange={(e: any) => {
                    const id = e?.target?.value ?? e;
                    setSelectedTeamId(id);
                    const t = (teams || []).find(
                      (x: any) => String(x?._id) === String(id),
                    );
                    setFieldValue("location", t?.location || "");
                  }}
                  onBlur={handleBlur("location")}
                  disabled={locationsLoading}
                />

                <AppAccessSection>
                  <div className="label">App Access</div>
                  <div className="apps">
                    {appsLoading ? (
                      <div className="apps-loading">
                        <span className="spinner" /> Loading apps…
                      </div>
                    ) : (
                      appOptions.map((app) => {
                      const selected = (values.appAccess || []).includes(app.id);
                      return (
                        <FormControlLabel
                          key={app.id}
                          control={
                            <Checkbox
                              size="small"
                              checked={selected}
                              onChange={() => {
                                const current = values.appAccess || [];
                                const next = current.includes(app.id)
                                  ? current.filter((a) => a !== app.id)
                                  : [...current, app.id];
                                setFieldValue("appAccess", next);
                              }}
                            />
                          }
                          label={
                            <span style={{ fontSize: "0.875rem" }}>
                              {app.label}
                            </span>
                          }
                        />
                      );
                      })
                    )}
                  </div>
                </AppAccessSection>
              </FormWrapper>

              <NewProjectModalBtn>
                <button onClick={close}>Cancel</button>
                <button
                  className="primary"
                  onClick={() => handleSubmit()}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Invite"}
                </button>
              </NewProjectModalBtn>
            </>
          )}
        </Formik>
      </NewProjectModalContent>
    </Modal>
  );
};

export default AddMemberModal;

const NewProjectModalContent = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
`;

const FormSectionHeader = styled("h3")`
  margin-top: 0rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.5rem;
  font-size: 1rem;
`;

const FormWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
  overflow-y: auto;
  padding-right: 0.5rem;
  max-height: calc(80vh - 120px);

  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const AppAccessSection = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .label {
    color: #52625d;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
  }

  .apps {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    border: 1px solid #d0d5dd;
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    min-height: 2.25rem;
  }

  .apps-loading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    color: #667085;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid #d0d5dd;
    border-top-color: #50589f;
    border-radius: 50%;
    display: inline-block;
    animation: addmembers-spin 0.7s linear infinite;
  }

  @keyframes addmembers-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const NewProjectModalBtn = styled("div")`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid #eaecf0;
  background: white;
  flex-shrink: 0;

  > button {
    all: unset;
    padding: 0.5rem 0.9rem;
    border-radius: 8px;
    border: 1px solid #02120d;
    display: flex;
    justify-content: center;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    cursor: pointer;
  }

  > .primary {
    background: #50589f;
    color: #f8f9fb;
    border: 1px solid #50589f;
    font-weight: 600;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;
