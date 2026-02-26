import React, { useEffect, useState } from "react";
import { styled } from "@mui/material";
import palettes from "@/constants/palettes";
import Input from "@/components/common/input";
import AddUserUpload from "./add-user-upload";
import { Formik, useFormikContext } from "formik";
import Button from "../common/button";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { INVITE_USER, UPDATE_USER } from "@/graphql/mutations/user";
import {
  IInitialValues,
  Role,
  UserTitle,
  generateEditUserPayLoad,
  initialValues,
  transformUserDataToFormikFormat,
  validationSchema,
} from "./formHelper";

import { notifyErrorFxn, notifySuccessFxn } from "@/utils/toast-fxn";
import { useRouter } from "next/router";
import { awsUpload } from "../../utils/uploadMedaia";
import { GET_USER_BY_ID } from "@/graphql/queries/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "@/atoms/user-atom";
import teamAtom from "@/atoms/team-atom";
import useTeamGraphql from "@/hooks/team/use-team-graphql";

// Helper component to set field values after data is loaded
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
      const matchingTeam = teams.find(
        (team) =>
          team.location?.toLowerCase() === userData.location?.toLowerCase() ||
          team.name?.toLowerCase() === userData.location?.toLowerCase(),
      );

      if (matchingTeam) {
        const locationValue =
          matchingTeam.location?.toLowerCase() ||
          matchingTeam.name?.toLowerCase();
        setFieldValue("location", locationValue);
      } else {
        setFieldValue("location", "");
      }
    }
  }, [userData, teams, setFieldValue]);

  return null;
};

const AddUserForms = () => {
  const [profileImage, setProfileImage] = useState("");
  const [Ruser, setRUser] = useRecoilState(userAtom);
  const [editInitialState, setEditInitialState] =
    useState<IInitialValues>(initialValues);
  const [userData, setUserData] = useState<any>(null);
  const teamsState = useRecoilValue(teamAtom);
  const teams = teamsState.teams || [];
  const [teamAtomState, setTeamAtomState] = useRecoilState(teamAtom);
  const { runGetTeamsQuery } = useTeamGraphql();
  const [teamsLoading, setTeamsLoading] = useState(false);

  const LocationOptions =
    teams.length > 0
      ? teams
          .map((team: any) => ({
            label: team.name,
            value: team.location?.toLowerCase() || team.name?.toLowerCase(),
          }))
          .filter((option) => option.value)
      : [
          {
            label: teamsLoading ? "Loading teams..." : "No teams available",
            value: "",
          },
        ];

  const [inviteUser, { data, loading, error }] = useMutation(INVITE_USER, {
    context: { clientName: "tracker" },
    onCompleted: (data) => {
      if (data?.inviteUsers) {
        notifySuccessFxn("Invite sent successfully");
      }
    },
    onError: (error) => {
      notifyErrorFxn(error?.message);
    },
  });

  const [fetchUser] = useLazyQuery<any>(GET_USER_BY_ID, {
    context: { clientName: "tracker" },
    onCompleted: (data) => {
      let name = data.getUserById.data?.name ? data.getUserById.data.name : "";
      let userDataObj = {
        ...data.getUserById.data,
        firstName: name.split(" ")[0] || "",
        lastName: name.split(" ")[1] || "",
      };

      setUserData(data.getUserById.data);

      const formData = transformUserDataToFormikFormat(
        data.getUserById.data as any,
      );

      setEditInitialState(formData);
    },
  });

  const [updateUser, { data: editUserData, loading: loadingUpdateUser }] =
    useMutation(UPDATE_USER, {
      context: { clientName: "tracker" },
      onCompleted: (data) => {
        if (data.editUser) {
          notifySuccessFxn("Profile updated successfully!");
        }
      },
      onError: (error) => {
        notifyErrorFxn(error?.message);
      },
    });

  const router = useRouter();
  const isEdit = router.query?.edit === "true";
  const isView = router.query?.view === "true";

  const onFileChange = async (event: any) => {
    try {
      const data = await awsUpload({
        file: event.target.files[0],
        fileName: event.target.files[0]?.name,
        dirName: event.target.files[0]?.name,
      });
      notifySuccessFxn("Image uploaded successfully!");
      setProfileImage(data?.location);
    } catch (error) {
      notifySuccessFxn("Error uploading image!");
    }
  };

  useEffect(() => {
    if (teams.length === 0) {
      setTeamsLoading(true);
      runGetTeamsQuery({ variables: { input: {} } })
        .then(({ data }) => {
          if (data?.getTeams?.success && data.getTeams.data) {
            setTeamAtomState((prev) => ({
              ...prev,
              teams: data.getTeams.data,
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching teams:", error);
        })
        .finally(() => {
          setTeamsLoading(false);
        });
    }
    if (isEdit || isView) {
      fetchUser({
        variables: {
          userId: router.query?.sId,
        },
      });
    }
  }, [teams.length, runGetTeamsQuery, isEdit, isView, router.query?.sId]);

  if ((isEdit || isView) && !editInitialState) {
    return <div>Loading...</div>;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={isEdit || isView ? editInitialState : initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        if (isEdit) {
          if (profileImage) delete values.profileImage;
          updateUser({
            variables: {
              input: {
                userId: router?.query?.sId,
                ...generateEditUserPayLoad({
                  profileImage,
                  ...values,
                  attachedOrganizationId:
                    Ruser?.userData?.attachedOrganization?._id,
                }),
              },
            },
          });
        } else {
          const invitePayload = {
            title: values.title,
            role: values.assignedRole,
            lastName: values.lastName,
            firstName: values.firstName,
            email: values.email,
            profileImg: profileImage || "",
            organization: Ruser?.userData?.attachedOrganization?._id,
            location: values.location || "",
            projectIds: [],
          };
          inviteUser({
            variables: {
              input: invitePayload,
            },
          });
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
        <ProfileFormsContainer>
          {isEdit && userData && (
            <LocationSetter userData={userData} teams={teams} />
          )}

          <PrimaryText>Personal Information</PrimaryText>

          <AddUserUpload
            isView={router.query?.view === "true"}
            onFileChange={onFileChange}
            profileImage={profileImage || (values.profileImage as string)}
            name={values.firstName}
          />
          <FormsContainer>
            <InputContainer>
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
            </InputContainer>
            <InputContainer>
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
            </InputContainer>
            <InputContainer>
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
                options={LocationOptions}
                type="select"
                required
                label="Team"
                placeholder={teamsLoading ? "Loading teams..." : "Select Team"}
                value={values.location}
                error={
                  touched.location && errors.location
                    ? `${errors.location}`
                    : ""
                }
                onChange={handleChange("location")}
                onBlur={handleBlur("location")}
                disabled={teamsLoading}
              />
            </InputContainer>
            <InputContainer>
              <Input
                type="select"
                options={[
                  { label: "14 Days", value: "14" },
                  { label: "15 Days", value: "15" },
                  { label: "16 Days", value: "16" },
                  { label: "17 Days", value: "17" },
                  { label: "18 Days", value: "18" },
                  { label: "19 Days", value: "19" },
                  { label: "20 Days", value: "20" },
                  { label: "21 Days", value: "21" },
                  { label: "22 Days", value: "22" },
                  { label: "23 Days", value: "23" },
                  { label: "24 Days", value: "24" },
                  { label: "25 Days", value: "25" },
                ]}
                label="Annual Leave Balance (Days)"
                placeholder="Select leave balance"
                value={String(values.annualLeaveBalance ?? 14)}
                error={
                  touched.annualLeaveBalance && errors.annualLeaveBalance
                    ? `${errors.annualLeaveBalance}`
                    : ""
                }
                onChange={(e: any) => {
                  const val = e.target?.value ?? e;
                  const numVal = parseInt(val, 10);
                  setFieldValue("annualLeaveBalance", numVal);
                }}
                onBlur={handleBlur("annualLeaveBalance")}
              />
              <Input
                type="select"
                options={[
                  { label: "1 Month", value: "1" },
                  { label: "2 Months", value: "2" },
                  { label: "3 Months", value: "3" },
                  { label: "4 Months", value: "4" },
                  { label: "5 Months", value: "5" },
                  { label: "6 Months", value: "6" },
                  { label: "7 Months", value: "7" },
                  { label: "8 Months", value: "8" },
                  { label: "9 Months", value: "9" },
                  { label: "10 Months", value: "10" },
                  { label: "11 Months", value: "11" },
                  { label: "12 Months", value: "12" },
                ]}
                label="Probation Period (Months)"
                placeholder="Select probation period"
                value={String(values.probationPeriod ?? 3)}
                error={
                  touched.probationPeriod && errors.probationPeriod
                    ? `${errors.probationPeriod}`
                    : ""
                }
                onChange={(e: any) => {
                  const val = e.target?.value ?? e;
                  const numVal = parseInt(val, 10);
                  setFieldValue("probationPeriod", numVal);
                }}
                onBlur={handleBlur("probationPeriod")}
              />
            </InputContainer>
          </FormsContainer>

          <ButtonContainer>
            <Button title="Go back" onClick={() => router.back()} />
            {!isView && (
              <Button
                variant="primary"
                title={isEdit ? "Update" : "Send Invite"}
                onClick={handleSubmit}
                loading={loading || loadingUpdateUser}
              />
            )}
          </ButtonContainer>
        </ProfileFormsContainer>
      )}
    </Formik>
  );
};

export default AddUserForms;

const ProfileFormsContainer = styled("div")(({ theme }) => ({
  fontFamily: "Inter",
}));

const PrimaryText = styled("div")(({ theme }) => ({
  fontSize: "1.125rem",
  color: palettes?.blue[0],
  fontWeight: 600,
  lineHeight: "1.75rem",
  borderBottom: `1px solid ${palettes?.gray[2]}`,
  paddingBottom: "0.5rem",
  marginBottom: "3rem",
  [theme.breakpoints.down("md")]: {
    fontSize: "1rem",
    lineHeight: "1.5rem",
    marginBottom: "2rem",
    paddingBottom: "0.4rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.95rem",
    lineHeight: "1.4rem",
    marginBottom: "1.5rem",
    paddingBottom: "0.35rem",
  },
}));

const ButtonContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    gap: "0.75rem",
  },
  [theme.breakpoints.down("sm")]: {
    gap: "0.5rem",
    "> button": {
      flex: 1,
      minWidth: 0,
    },
  },
}));

const FormsContainer = styled("div")(({ theme }) => ({
  marginBottom: "4.5rem",
  [theme.breakpoints.down("md")]: {
    marginBottom: "3rem",
  },
  [theme.breakpoints.down("sm")]: {
    marginBottom: "2rem",
  },
}));

const InputContainer = styled("div")(({ theme }) => ({
  display: "flex",
  gap: "1.5rem",
  marginBottom: "1.5rem",
  [theme.breakpoints.down("md")]: {
    gap: "1rem",
    marginBottom: "1.25rem",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: "0",
    marginBottom: "1rem",
    "> div": {
      marginBottom: "1rem",
      "&:last-child": {
        marginBottom: "0",
      },
    },
  },
}));
