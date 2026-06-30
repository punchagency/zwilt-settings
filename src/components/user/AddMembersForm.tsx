import React, {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "@/config/axiosConfig";
import { apiUrl } from "@/config/apiUrl";
import Modal from "../modal";
import { styled, Skeleton, Box } from "@mui/material";
import { awsUpload } from "@/utils/uploadMedaia";
import Image from "next/image";
import ImageIcon from "@mui/icons-material/Image";
import Input from "../common/input";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  UPDATE_USER,
  ADD_PROJECT_MEMBER,
} from "@/graphql/mutations/user";
import { INVITE_USER } from "@/graphql/mutations/manageTeam";
import CloseIcon from "@mui/icons-material/Close";
import {
  IInitialValues,
  Role,
  UserTitle,
  generateInviteUserPayLoad,
  generateEditUserPayLoad,
  initialValues,
  transformUserDataToFormikFormat,
  validationSchema,
} from "./add-user/formHelper";
import { notifyErrorFxn, notifySuccessFxn } from "@/utils/toast-fxn";
import { GET_USER_BY_ID } from "@/graphql/queries/auth";
import { useRouter } from "next/router";
import { Formik, useFormikContext } from "formik";
import userAtom from "@/atoms/user-atom";
import { useRecoilState, useRecoilValue } from "recoil";
import { GET_PROJECTS_DATA } from "@/graphql/queries/user";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import teamAtom from "@/atoms/team-atom";
import useTeamGraphql from "@/hooks/team/use-team-graphql";
import useLocationOptions from "@/hooks/team/use-location-options";

const LocationSetter = ({
  userData,
  teams,
}: {
  userData: any;
  teams: any[];
}) => {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (userData && userData.location && teams.length > 0) {
      // Find matching location option by checking if userData.location matches value or label
      const matchingOption = teams.find(
        (option) =>
          option.value?.toLowerCase() === userData.location?.toLowerCase() ||
          option.label?.toLowerCase() === userData.location?.toLowerCase(),
      );

      if (matchingOption) {
        setFieldValue("location", matchingOption.value);
      } else {
        setFieldValue("location", "");
      }
    }
  }, [userData, teams, setFieldValue]);

  return null;
};

interface AddMembersFormProps {
  open: boolean;
  onComplete?: () => void;
  onClose?: () => void;
  existingUsage?: Record<string, number>;
}

interface AppPricing {
  _id: string;
  appId: string;
  name: string;
  isActive: boolean;
  maxSeats?: number;
}

interface PricingData {
  pricing: {
    ownerAndManager: number;
    member: number;
  };
  apps: AppPricing[];
}

function AddMembersForm({
  open,
  onComplete,
  onClose,
  existingUsage = {},
}: AddMembersFormProps) {
  const [user, setUser] = useRecoilState(userAtom);
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState("");
  const [editInitialState, setEditInitialState] = useState<IInitialValues>();
  const [userData, setUserData] = useState<any>(null);
  const { locationOptions, teams, loading: locationsLoading } =
    useLocationOptions();

  // The team selector is keyed by the Team entity _id (unique) — never by the
  // location string — so the selection is unambiguous even if two teams happen to
  // share a location. The location string is derived from the chosen team for the
  // user's display/label field.
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const teamOptions = (teams || []).map((t: any) => ({
    label: t?.name || t?.location || "",
    value: String(t?._id || ""),
  }));

  // Edit mode: prefill the selector from the member's current team (matched by
  // location, since that's what the member doc carries) so the dropdown reflects
  // their team.
  useEffect(() => {
    if (userData?.location && (teams || []).length > 0) {
      const t = (teams || []).find(
        (x: any) =>
          (x?.location || "").toLowerCase().trim() ===
          String(userData.location).toLowerCase().trim(),
      );
      setSelectedTeamId(t ? String(t._id) : "");
    }
  }, [userData, teams]);

  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [pricingLoading, setPricingLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/pricing`);
        if (response.data.success) {
          setPricingData(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch pricing:", err);
      } finally {
        setPricingLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const [inviteUser, { data, loading, error }] = useMutation(INVITE_USER, {
    onCompleted: (data) => {
      if (data?.inviteUser) {
        notifySuccessFxn("Invite sent successfully");
        handleClose();
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

  const [fetchUser, { loading: loadingUser }] = useLazyQuery<any>(GET_USER_BY_ID, {
    onCompleted: (data) => {
      let name = data.getUserById.data?.name ? data.getUserById.data.name : "";
      let userDataObj = {
        ...data.getUserById.data,
        firstName: name.split(" ")[0] || "",
        lastName: name.split(" ")[1] || "",
      };

      setUserData(data.getUserById.data);

      setEditInitialState(
        transformUserDataToFormikFormat(data.getUserById.data as any),
      );
    },
  });

  const [updateUser, { data: editUserData, loading: loadingUpdateUser }] =
    useMutation(UPDATE_USER, {
      onCompleted: (data) => {
        if (data.editUser) {
          notifySuccessFxn("Profile updated successfully!");
        }
      },
      onError: (error) => {
        notifyErrorFxn(error?.message);
      },
    });

  const [addProjectMember] = useMutation(ADD_PROJECT_MEMBER);

  const router = useRouter();
  const isEdit = router.query?.edit === "true";
  const isView = router.query?.view === "true";

  const [logo, setLogo] = useState<File | null>(null);

  const handleClose = () => {
    onComplete && onComplete();
    onClose && onClose();
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 2 * 1024 * 1024) {
        setImageError(true);
      } else {
        setSelectedImage(URL.createObjectURL(file));
        setLogo(file);
      }
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 2 * 1024 * 1024) {
        setImageError(true);
      } else {
        setSelectedImage(URL.createObjectURL(file));
        setLogo(file);
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleContainerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    const uploadProfileImage = async () => {
      if (logo) {
        try {
          const data = await awsUpload({
            file: logo as File,
            fileName: logo?.name as string,
            dirName: logo?.name as string,
          });

          setProfileImage(data?.location);
        } catch (error) {
          console.error("Profile image upload error:", error);
        }
      }
    };
    uploadProfileImage();
  }, [logo]);

  return (
    <Modal
      handleClose={handleClose}
      open={open}
      borderRadius="15px"
      title={"Add Members"}
      width="30rem"
      height="45rem"
    >
      <AddMembersFormWrapper>
        {loadingUser ? (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Skeleton variant="circular" width={64} height={64} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            </Box>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 2, borderRadius: 1 }} />
            ))}
          </Box>
        ) : (
        <Formik
          enableReinitialize
          initialValues={editInitialState || initialValues}
          validationSchema={validationSchema.shape({
            teamId:
              (window as any).yup?.string?.().required?.("Team is required") ||
              undefined,
          })}
          onSubmit={async (values) => {
            const overLimitApps = values.appAccess.filter((appId) => {
              const app = pricingData?.apps?.find((a) => a.appId === appId);
              if (!app || !app.maxSeats) return false;
              const usage = existingUsage[appId] || 0;
              // Check if we are adding a seat that exceeds max
              const isAlreadyAssigned =
                isEdit && userData?.apps?.includes(appId);
              return !isAlreadyAssigned && usage + 1 > app.maxSeats;
            });

            if (overLimitApps.length > 0) {
              const appNames = overLimitApps
                .map(
                  (id) => pricingData?.apps?.find((a) => a.appId === id)?.name,
                )
                .join(", ");
              notifyErrorFxn(
                `Seat limit reached for: ${appNames}. Please upgrade your plan or remove members.`,
              );
              return;
            }

            try {
              if (isEdit) {
                if (profileImage) delete values.profileImage;
                await updateUser({
                  variables: {
                    input: {
                      userId: router?.query?.sId,
                      ...generateEditUserPayLoad({
                        profileImage,
                        ...values,
                        attachedOrganizationId:
                          user?.userData?.attachedOrganization?._id,
                      }),
                    },
                  },
                });
              } else {
                try {
                  // Ecosystem A (InvitationModel): the manageTeam `inviteUser`
                  // mutation derives the org from the caller. The invitee's name
                  // is collected on the store-client signup page at accept time,
                  // but the admin-assigned Team (location) must ride on the
                  // invite — it's applied to the user on accept.
                  const payload = generateInviteUserPayLoad({
                    profileImage,
                    ...values,
                    attachedOrganizationId:
                      user?.userData?.attachedOrganization?._id,
                  });
                  const result = await inviteUser({
                    variables: {
                      input: {
                        email: payload.email,
                        role: payload.role,
                        appAccess: payload.appAccess || [],
                        location: payload.location || "",
                        teamId: selectedTeamId,
                      },
                    },
                  });
                  if (result?.data?.inviteUser) {
                  }
                } catch (error: any) {
                  console.error("Invite user error:", error);

                  if (
                    error?.message?.includes("E11000") ||
                    error?.message?.includes("duplicate key") ||
                    error?.message?.includes("zwilt-tracker.users index")
                  ) {
                    notifyErrorFxn(
                      "This email address is already registered. Please use a different email.",
                    );
                  } else if (error.message.includes("buffering timed out")) {
                    notifyErrorFxn(
                      "Server connection timed out. Please try again.",
                    );
                  } else {
                    notifyErrorFxn(error?.message || "Failed to invite user");
                  }
                }
              }
            } catch (error: any) {
              console.error("Form submission error:", error);

              if (
                error?.message?.includes("E11000") ||
                error?.message?.includes("duplicate key") ||
                error?.message?.includes("zwilt-tracker.users index")
              ) {
                notifyErrorFxn(
                  "This email address is already registered. Please use a different email.",
                );
              } else if (error.message.includes("buffering timed out")) {
                notifyErrorFxn(
                  "Server connection timed out. Please try again.",
                );
              } else {
                notifyErrorFxn(error?.message || "An error occurred");
              }
            }
          }}
        >
          {({
            handleBlur,
            handleChange,
            handleSubmit,
            resetForm,
            touched,
            errors,
            isValid,
            dirty,
            values,
            setFieldValue,
          }) => (
            <>
              {isEdit && userData && (
                <LocationSetter userData={userData} teams={locationOptions} />
              )}
              <FormWrapper>
                <InputWrapper>
                  {selectedImage ? (
                    <div
                      onClick={() => {
                        setImageError(false);
                        setSelectedImage(null);
                      }}
                      style={{
                        background: "#EAECF0",
                        borderRadius: "10px",
                        alignItems: "center",
                        display: "flex",
                        width: "3rem",
                        justifyContent: "center",
                        position: "absolute",
                        top: "30%",
                        cursor: "pointer",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1,
                        height: "3rem",
                      }}
                    >
                      <CloseIcon />
                    </div>
                  ) : profileImage ? (
                    <div
                      onClick={() => {
                        setProfileImage("");
                        setImageError(false);
                      }}
                      style={{
                        background: "#EAECF0",
                        borderRadius: "10px",
                        alignItems: "center",
                        display: "flex",
                        width: "3rem",
                        justifyContent: "center",
                        position: "absolute",
                        top: "30%",
                        cursor: "pointer",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1,
                        height: "3rem",
                      }}
                    >
                      <CloseIcon />
                    </div>
                  ) : (
                    ""
                  )}
                  <div
                    className="image-upload-container"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={handleContainerClick}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="image-upload-input"
                      ref={fileInputRef}
                    />
                    {selectedImage || profileImage ? (
                      <Image
                        width={200}
                        height={100}
                        src={profileImage || selectedImage || ""}
                        layout="responsive"
                        alt="Preview"
                        className="image-preview"
                      />
                    ) : imageError ? (
                      <InputInfoWrapper>
                        <span style={{ color: "red" }}>
                          Image too large! Choose a smaller image.
                        </span>
                      </InputInfoWrapper>
                    ) : (
                      <>
                        <InputInfoWrapper>
                          <ImageIcon
                            style={{ fontSize: 48, color: "#98A2B3" }}
                          />

                          <span>Click to upload image.</span>
                          <span>
                            Only use .jpg, .jpeg, .png, & svg. Maximum file size
                            2MB.
                          </span>
                        </InputInfoWrapper>
                      </>
                    )}
                  </div>
                </InputWrapper>
                <Input
                  required
                  options={UserTitle}
                  value={values.title}
                  type="select"
                  label="Title"
                  placeholder="Choose Title for Employee"
                  error={touched.title && errors.title ? `${errors.title}` : ""}
                  onChange={handleChange("title")}
                  onBlur={handleBlur("title")}
                />
                <Input
                  required
                  label="First Name"
                  placeholder="Enter Employee's First Name"
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
                  placeholder="Enter Employee's Last Name"
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
                  placeholder="zaidjamshaid@ourcompany.com"
                  value={values.email}
                  error={touched.email && errors.email ? `${errors.email}` : ""}
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
                <Input
                  options={Role}
                  type="select"
                  required
                  label="Assigned Role"
                  placeholder="Organization Manager"
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
                  options={teamOptions}
                  type="select"
                  required
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
                    // Keep the Formik location string in sync for the member's
                    // label/display and the required-field validation.
                    setFieldValue("location", t?.location || "");
                  }}
                  onBlur={handleBlur("location")}
                  disabled={locationsLoading}
                />

                <div style={{ marginTop: "1rem" }}>
                  <div
                    style={{
                      fontWeight: 500,
                      lineHeight: "1.5rem",
                      color: "#101828",
                      marginBottom: "0.5rem",
                      display: "block",
                      fontSize: "0.875rem",
                    }}
                  >
                    App Access
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#667085",
                      marginBottom: "0.5rem",
                      marginTop: "-0.25rem",
                    }}
                  >
                    Note: Pricing per seat depends on the role and app access
                    level.
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      border: "1px solid #D0D5DD",
                      borderRadius: "8px",
                      padding: "0.5rem",
                    }}
                  >
                    {pricingLoading ? (
                      <div style={{ padding: "10px", fontSize: "0.75rem" }}>
                        Loading application registry...
                      </div>
                    ) : (
                      pricingData?.apps?.map((app) => {
                        const isPremiumRole =
                          values.assignedRole === "ORGANIZATION_OWNER" ||
                          values.assignedRole === "ORGANIZATION_MANAGER";
                        const price = isPremiumRole
                          ? pricingData.pricing.ownerAndManager
                          : pricingData.pricing.member;
                        const isSelected = values.appAccess?.includes(
                          app.appId,
                        );

                        return (
                          <div
                            key={app.appId}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              background: isSelected
                                ? "#F9FAFB"
                                : "transparent",
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={isSelected}
                                  onChange={() => {
                                    const currentApps = values.appAccess || [];
                                    const appId = app.appId;
                                    const newApps = currentApps.includes(appId)
                                      ? currentApps.filter((a) => a !== appId)
                                      : [...currentApps, appId];
                                    setFieldValue("appAccess", newApps);
                                  }}
                                />
                              }
                              label={
                                <span style={{ fontSize: "0.875rem" }}>
                                  {app.name}
                                  <span
                                    style={{
                                      fontSize: "0.75rem",
                                      color:
                                        app.maxSeats &&
                                        (existingUsage[app.appId] || 0) >=
                                          app.maxSeats
                                          ? "#D92D20"
                                          : "#667085",
                                      marginLeft: "4px",
                                      fontWeight:
                                        app.maxSeats &&
                                        (existingUsage[app.appId] || 0) >=
                                          app.maxSeats
                                          ? 600
                                          : 400,
                                    }}
                                  >
                                    ({existingUsage[app.appId] || 0} /{" "}
                                    {app.maxSeats || "∞"} seats)
                                    {app.maxSeats &&
                                      (existingUsage[app.appId] || 0) >=
                                        app.maxSeats &&
                                      " - Limit Reached"}
                                  </span>
                                </span>
                              }
                            />
                            <span
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                color: isSelected ? "#101828" : "#98A2B3",
                              }}
                            >
                              ${price.toFixed(2)}/mo
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                  {values.appAccess &&
                    values.appAccess.length > 0 &&
                    pricingData && (
                      <div
                        style={{
                          marginTop: "0.75rem",
                          padding: "0.75rem",
                          background: "#F5F8FF",
                          borderRadius: "8px",
                          border: "1px solid #D1E0FF",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "#344054",
                          }}
                        >
                          Total Monthly Cost:
                        </span>
                        <span
                          style={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "#244BB6",
                          }}
                        >
                          $
                          {(
                            values.appAccess.length *
                            (values.assignedRole === "ORGANIZATION_OWNER" ||
                            values.assignedRole === "ORGANIZATION_MANAGER"
                              ? pricingData.pricing.ownerAndManager
                              : pricingData.pricing.member)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                </div>
              </FormWrapper>

              <AddMembersFormModalBtn>
                <button
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="primary"
                  onClick={() => handleSubmit()}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Member"}
                </button>
              </AddMembersFormModalBtn>
            </>
          )}
        </Formik>
        )}
      </AddMembersFormWrapper>
    </Modal>
  );
}

const AddMembersFormWrapper = styled("div")`
  padding-top: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
`;

const AddMembersFormModalBtn = styled("div")`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

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

const FormWrapper = styled("div")`
  flex: 1;
  overflow: auto;
  padding-right: 0.5rem;
  height: 70%;

  /* Scrollbar styles */
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

  ::-webkit-scrollbar-corner {
    background: #f1f1f1;
  }
`;

const InputWrapper = styled("div")`
  margin-bottom: 0.6rem;
  position: relative;
  .image-upload-container {
    width: 100%;
    height: 10rem;
    border: 1px dashed rgba(17, 25, 41, 0.2);
    border-radius: 10px;
    background: #f4f6fa;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
  }

  .image-upload-input {
    display: none;
  }

  .image-preview {
    max-width: 100%;
    max-height: 100%;
  }

  .image-placeholder {
    text-align: center;
    color: #999;
    font-size: 16px;
  }
`;

const InputInfoWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  justify-conent: center;
  align-items: center;
  gap: 5px;

  > span:nth-of-type(1) {
    font-weight: 500;
    color: #244bb6;
    font-size: 0.876rem;
    line-height: 1.25rem;
  }

  > span:nth-of-type(2) {
    color: #52625d;
    font-size: 0.75rem;
    line-height: 1.125rem;
  }
`;

export default AddMembersForm;
