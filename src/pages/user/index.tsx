"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
// import PhoneInput from "react-phone-number-input";
// import "react-phone-number-input/style.css";
// import { GetUser } from "@/graphql/queries/user";
import { socket } from "../../lib/external-socket";
import DeleteAccountModal from "@/components/user/delete-account-modal";
import { UpdateUserProfile } from "@/graphql/mutations/user";
import { useDeleteAccount } from "@/store/phone-account-store";
import { useMutation } from "@apollo/react-hooks";
import { useFormik } from "formik";
import { AnimatePresence } from "framer-motion";
import { PhoneNumberUtil } from "google-libphonenumber";
import { CiSquareRemove } from "react-icons/ci";
//import {GET_USER} from '../../graphql/queries/user'
import { calculatePxToPercentage } from "@/../utils/cssHelper";
import { awsUpload } from "@/aws/awsUpload";
import { Box, Divider, Stack, Typography, styled } from "@mui/material";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { ClipLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUser from "utils/recoil_store/hooks/use-user-state";
import * as Yup from "yup";
import { notifyErrorFxn, notifySuccessFxn } from "../../../utils/toast-fxn";
import { columns } from "@/components/phone_account/tableInfo";

// Import the placeholder image as a static asset
import placeholderImage from "../../assests/images/avatar-PH.jpeg";

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const handleUpload = (e: any) => {
  const input = document.getElementById("fileUpload");
  input?.click();
  // console.log({input})
};

const inputStyles = {
  width: "100%",
  height: calculatePxToPercentage(50),
  fontSize: calculatePxToPercentage(16),
  borderRadius: calculatePxToPercentage(15),
  padding: `${calculatePxToPercentage(10)} ${calculatePxToPercentage(15)}`,
  outline: "none",
  margin: 0,
};

const phoneStyle = {};

interface userType {
  userId: string;
}

const normalizeImageUrl = (url: string | null): string | null => {
  if (!url) return null;
  
  // If it's already a data URL or object URL, return as is
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // Make sure S3 URLs use https
  if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }
  
  return url;
};

const Page: React.FC<userType> = ({ userId }) => {
  //userData Types
  interface User {
    email: string;
    firstName: string;
    lastName: string;
    name: string;
    phone: string;
    __typename: string;
    profile_img: string;
  }

  interface Client {
    role: string;
    user: User;
    __typename: string;
    _id: string;
  }

  //usestates
  const defaultImage = placeholderImage.src || "/default-avatar.jpg";
  const [dataUploaded, setDataUploaded] = useState(true);
  const { updateUser, userState } = useUser();
  const user = userState?.currentUser?.user;
  const [profileImage, setProfileImage] = useState<string>(
    normalizeImageUrl(user?.profile_img) || defaultImage
  );
  const [file, setFile] = useState<any>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  //mutation
  const [updateUserProfile] = useMutation(UpdateUserProfile, {
    onCompleted: (data) => {
      setDataUploaded(true);
    },
    onError: (error) => {
      notifyErrorFxn("Error updating profile");
      setDataUploaded(true);
    },
  });

  const showDelete = useDeleteAccount((state) => state.showDelete);
  const setShowDelete = useDeleteAccount((state) => state.setShowDelete);

  // handling image upload to AWS
  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) {
      notifyErrorFxn("No file selected");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      notifyErrorFxn(
        "Invalid file type. Only JPG, JPEG, and PNG formats are allowed"
      );
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notifyErrorFxn("File size exceeds 5MB limit");
      return;
    }

    try {
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
      setImageLoadError(false);
      setFile(file);
    } catch (error) {
      console.error("Error generating preview:", error);
      notifyErrorFxn("Failed to generate image preview");
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      teamRole: user?.role || "user",
      image: user?.profile_img || "",
    },
    enableReinitialize: true, // This will reinitialize the form when userData changes
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async () => {
      handleFormSubmit();
    },
  });

  const handleFormSubmit = async () => {
    if (
      formik.values.firstName === "" ||
      formik.values.lastName === "" ||
      formik.values.phone === ""
    ) {
      notifyErrorFxn("Please fill the required fields");
      return;
    }

    if (!isValid) {
      notifyErrorFxn("Please enter a valid phone number");
      return;
    }

    setDataUploaded(false);
    let uploadedImageUrl = null;

    // Only attempt to upload if there's a new file
    if (file) {
      try {
        const data = await awsUpload({
          file,
          fileName: file.name,
          dirName: `profile_images/`,
        });
        uploadedImageUrl = data?.location;
      } catch (error) {
        console.error("Image upload failed:", error);
        notifyErrorFxn(
          "Failed to upload profile image, but profile will still be updated"
        );
      }
    }

    try {
      // Proceed with profile update regardless of image upload success
      await updateUserProfile({
        variables: {
          input: {
            firstName: formik.values.firstName,
            lastName: formik.values.lastName,
            profile_img: file
              ? uploadedImageUrl
              : profileImage === defaultImage
              ? null
              : profileImage,
            phone: formik.values.phone,
          },
        },
      });

      updateUser({
        currentUser: {
          user: {
            ...user,
            firstName: formik.values.firstName,
            lastName: formik.values.lastName,
            name: formik.values.firstName + " " + formik.values.lastName,
            profile_img: file
              ? uploadedImageUrl
              : profileImage === defaultImage
              ? null
              : profileImage,
          },
        },
      });

      socket.emit("updateProfile", {
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        imageUrl: file
          ? uploadedImageUrl
          : profileImage === defaultImage
          ? null
          : profileImage,
        name: formik.values.firstName + " " + formik.values.lastName,
      });

      notifySuccessFxn("Profile updated successfully");
      // Reset the file state after successful upload
      setFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      notifyErrorFxn("Error updating profile");
    } finally {
      setDataUploaded(true);
    }
  };

  const isValid = isPhoneValid(formik.values.phone);
  const handleImageRemove = () => {
    setProfileImage(defaultImage);
  };

  // Add a function to handle image loading errors
  const handleImageError = () => {
    console.log("Image failed to load, using fallback");
    setImageLoadError(true);
  };

  return (
    <Wrapper>
      {!userState && (
        <div className=" absolute top-[0.208vw] flex w-[75.26vw] h-[85vh] rounded-[1.56vw] bg-white items-center justify-center z-50">
          <ClipLoader />
        </div>
      )}

      <ToastContainer />
      <div className="relative bg-white rounded-lg">
        <div className=" w-full z-50 top-[0.83vw]  bg-white">
          <Heading>
            <CustomText className="page-title">User Profile</CustomText>
            <CustomText className="page-subtext">
              This is information about you, you can change your information
              here.
            </CustomText>
          </Heading>
          <SectionDivider />
          <Body className="scrollbar-thin">
            <div className="mb-[1.25vw] md:mb-0 md:mr-[1.25vw] ">
              <Stack
                sx={{
                  gap: calculatePxToPercentage(20),
                }}>
                <ProfileSection className="top-section">
                  <CustomText className="profile-img">Profile Image</CustomText>
                  <ImageContainer className="group">
                    <Image
                      src={
                        imageLoadError
                          ? defaultImage
                          : profileImage || defaultImage
                      }
                      alt="Profile"
                      width={100}
                      height={100}
                      className="object-cover w-full h-full group-hover:opacity-30 transition-opacity duration-300"
                      onError={handleImageError}
                    />
                    {profileImage !== defaultImage && (
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="hidden group-hover:flex items-center justify-center text-[#2424  d1b2] hover:border-[#b4b4c8] hover:bg-[#f4f4fa00] p-2 rounded-full cursor-pointer border-[#E0E0E9] border hover:text-[#282833] absolute inset-0">
                        <CiSquareRemove className="text-2xl" />
                      </button>
                    )}
                  </ImageContainer>
                </ProfileSection>
                <ProfileSection className="upload-section">
                  <UploadButton onClick={handleUpload}>Upload</UploadButton>
                  <CustomText className="upload-size">
                    Max Size 600x600px
                  </CustomText>
                </ProfileSection>
              </Stack>

              <input
                type="file"
                accept="image/*"
                id="fileUpload"
                onChange={onFileChange}
                style={{ display: "none" }}
              />
            </div>

            <Form
              component="form"
              onSubmit={async (e: any) => {
                e.preventDefault();
                formik.handleSubmit();
              }}>
              <div>
                <div className=" w-full mb-[0.83vw] grid grid-cols-2 gap-[0.83vw]">
                  <FormContainer>
                    <CustomText className="form-label">First Name</CustomText>
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={(e) => {
                          const { value } = e.target;
                          if (/^[A-Za-z]*$/.test(value)) {
                            formik.handleChange(e);
                          }
                        }}
                        onBlur={formik.handleBlur}
                        style={{
                          border: `0.0521vw solid ${
                            formik.touched.firstName && formik.errors.firstName
                              ? "#E0E0E9"
                              : "#E0E0E9"
                          }`,
                          ...inputStyles,
                        }}
                      />
                      {formik.touched.firstName && formik.errors.firstName ? (
                        <FormError>
                          {typeof formik.errors.firstName === "string"
                            ? formik.errors.firstName
                            : null}
                        </FormError>
                      ) : null}
                    </div>
                  </FormContainer>
                  <FormContainer>
                    <CustomText className="form-label">Last Name</CustomText>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={(e) => {
                          const { value } = e.target;
                          if (/^[A-Za-z]*$/.test(value)) {
                            formik.handleChange(e);
                          }
                        }}
                        onBlur={formik.handleBlur}
                        style={{
                          border: `0.0521vw solid ${
                            formik.touched.lastName && formik.errors.lastName
                              ? "#E0E0E9"
                              : "#E0E0E9"
                          }`,
                          ...inputStyles,
                        }}
                      />
                      {formik.touched.lastName && formik.errors.lastName ? (
                        <FormError>
                          {typeof formik.errors.lastName === "string"
                            ? formik.errors.lastName
                            : null}
                        </FormError>
                      ) : null}
                    </div>
                  </FormContainer>
                </div>
                <div className=" mb-[0.83vw] grid grid-cols-2  gap-[0.83vw]">
                  <FormContainer>
                    <CustomText className="form-label">Email</CustomText>
                    <div className="">
                      <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={true}
                        style={{
                          border: `0.0521vw solid ${
                            formik.touched.email && formik.errors.email
                              ? "#E0E0E9"
                              : "#E0E0E9"
                          }`,
                          ...inputStyles,
                        }}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <FormError>
                          {typeof formik.errors.email === "string"
                            ? formik.errors.email
                            : null}
                        </FormError>
                      ) : null}
                    </div>
                  </FormContainer>
                  <FormContainer>
                    <CustomText className="form-label">Phone</CustomText>
                    <div className="">
                      <PhoneInput
                        defaultCountry="ua"
                        value={formik?.values?.phone}
                        onBlur={formik.handleBlur}
                        onChange={(value: any) =>
                          formik.setFieldValue("phone", value || "")
                        }
                        // inputStyle={{
                        //   border: `1px solid ${formik.touched.phone && formik.errors.phone ? '#E0E0E9' : '#E0E0E9'}`,
                        //   ...inputStyles
                        // }}
                        // buttonClassName={`h-[40px] !h-[40px]`}
                        inputClassName={`phone w-full h-[2.60417vw] !h-[2.60417vw] px-[0.83vw] !text-[0.83vw] focus:border-none  rounded-[0.73vw] focus:outline-none `}
                      />
                      {formik.touched.phone && formik.errors.phone ? (
                        <FormError>
                          {" "}
                          {typeof formik.errors.phone === "string"
                            ? formik.errors.phone
                            : null}
                        </FormError>
                      ) : null}
                      {formik.values.phone.length > 4 && !isValid && (
                        <FormError>Phone is not valid</FormError>
                      )}
                    </div>
                  </FormContainer>
                </div>
                <FormContainer>
                  <CustomText className="form-label">Team Role</CustomText>
                  <div>
                    <input
                      disabled
                      type="text"
                      name="teamRole"
                      value={formik.values.teamRole}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{
                        border: `0.0521vw solid ${
                          formik.touched.teamRole && formik.errors.teamRole
                            ? "#E0E0E9"
                            : "#E0E0E9"
                        }`,
                        ...inputStyles,
                      }}
                    />
                    {formik.touched.teamRole && formik.errors.teamRole ? (
                      <FormError>
                        {typeof formik.errors.teamRole === "string"
                          ? formik.errors.teamRole
                          : null}
                      </FormError>
                    ) : null}
                  </div>
                </FormContainer>
              </div>
              <div className="text-right">
                <SaveButton component={"button"} type="submit">
                  {dataUploaded ? (
                    "Save"
                  ) : (
                    <ClipLoader size={18} color="#ffff" />
                  )}
                </SaveButton>
              </div>
            </Form>
            <div className=" bg-[#FEE4E2] w-[72.24vw] h-[6.56vw] rounded-[1.042vw] flex justify-between items-center py-[1.5vh] px-[1.5vw] mt-[2.56vw] mb-[2.5rem]">
              <div>
                <p className="font-[600] text-[1.25vw] text-[#F04438]">
                  Delete Account
                </p>
                <p className="font-[500] text-[0.83vw] text-[#F97066] w-[24.9vw]">
                  Deleting you account will remove all of your information from
                  our database. This can not be undone.
                </p>
              </div>
              <div>
                <button
                  onClick={() => setShowDelete(true)}
                  className="w-[9.68vw] h-[2.604vw] bg-[#F04438] hover:bg-[#f03838]  text-[white] rounded-[0.781vw] font-[500] text-[0.93vw]">
                  Delete
                </button>
              </div>
            </div>
          </Body>
        </div>
      </div>
      <AnimatePresence>
        {showDelete && (
          <DeleteAccountModal
            isOpen={showDelete}
            onClose={() => setShowDelete(false)}
            userName={formik.values.firstName + " " + formik.values.lastName}
            // userImage={formik.values.image}
            userImage={profileImage}
            userEmail={formik.values.email}
            role={formik.values.teamRole}
          />
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

export default Page;

const Wrapper = styled(Stack)(({ theme }) => ({
  height: "100%",
  padding: `${calculatePxToPercentage(24)} 0`,
  overflowY: "hidden",
  width: "100%",
}));

const Heading = styled(Stack)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: calculatePxToPercentage(10),
  padding: `0 ${calculatePxToPercentage(24)}`,
  width: "100%",
  borderBottom: "0.0521vw",
}));

const Body = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  background: "white",
  padding: `0 ${calculatePxToPercentage(30)}`,
  height: "70vh",
  overflowY: "scroll",
  overflowX: "hidden",
}));

const SectionDivider = styled(Divider)(({ theme }) => ({
  marginTop: calculatePxToPercentage(20),
  marginBottom: calculatePxToPercentage(29),
  height: "0.0521vw",
}));

const ProfileSection = styled(Stack)(({ theme }) => ({
  "&.top-section": {
    gap: calculatePxToPercentage(29),
  },

  "&.upload-section": {
    flexDirection: "row",
    alignItems: "center",
    gap: calculatePxToPercentage(22),
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: calculatePxToPercentage(164),
  height: calculatePxToPercentage(161),
  borderRadius: calculatePxToPercentage(120),
  position: "relative",
  overflow: "hidden",
}));

const UploadButton = styled(Box)(({ theme }) => ({
  color: "#282833",
  opacity: 0.7,
  borderRadius: calculatePxToPercentage(15),
  width: calculatePxToPercentage(92),
  height: calculatePxToPercentage(40),
  border: "1px solid #E0E0E9",
  padding: `${calculatePxToPercentage(10)} ${calculatePxToPercentage(20)}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: calculatePxToPercentage(16),
  lineHeight: calculatePxToPercentage(19.2),

  "&:hover": {
    border: "0.0521vw solid #B4B4C8",
    background: "#F4F4FA",
    opacity: 1,
  },
}));

const Form = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  marginTop: calculatePxToPercentage(45),
  gap: calculatePxToPercentage(18),
}));

const FormContainer = styled(Stack)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "0.9375vw",
  paddingBottom: calculatePxToPercentage(10),
}));

const FormError = styled(Typography)(({ theme }) => ({
  color: "#F04438",
  textAlign: "left",
  fontWeight: 500,
  fontSize: calculatePxToPercentage(14),
}));

interface SaveButtonProps {
  // disabled: boolean;
  type?: string;
}

const SaveButton = styled(Box)<SaveButtonProps>(({ theme }) => ({
  background: "#50589F",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 500,
  fontSize: calculatePxToPercentage(18),
  outline: "none",
  border: "none",
  marginTop: calculatePxToPercentage(29),
  width: calculatePxToPercentage(185),
  height: calculatePxToPercentage(50),
  padding: `${calculatePxToPercentage(10)} ${calculatePxToPercentage(24)}`,
  color: "white",
  borderRadius: calculatePxToPercentage(15),
  // cursor: disabled ? "not-allowed" : "pointer",

  "&:hover": {
    background: "#3C448B",
  },
}));

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

  "&.profile-img": {
    fontWeight: 600,
    fontSize: calculatePxToPercentage(18),
    lineHeight: calculatePxToPercentage(21.8),
    color: "#282833",
  },

  "&.upload-size": {
    color: "#7E7E85",
    fontWeight: 400,
    fontSize: calculatePxToPercentage(16),
    lineHeight: calculatePxToPercentage(19.2),
  },

  "&.form-label": {
    fontWeight: 600,
    fontSize: calculatePxToPercentage(18),
    lineHeight: calculatePxToPercentage(21.6),
    color: "#282833",
    margin: 0,
    padding: 0,
  },
}));
