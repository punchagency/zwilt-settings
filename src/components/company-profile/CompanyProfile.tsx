"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Chevron from "@/assests/icons/chevron.svg";
import { industries, Industry, sanitizeFileName } from "../../../utils";
import Tiptap from "@/components/company/tiptap";
import { FaPhotoVideo } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import { AnimatePresence } from "framer-motion";
import SocialMediaModal from "@/components/company/social-media-modal";
import SocialMediaLinks from "@/components/company/social-media";
import { FiPlus } from "react-icons/fi";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { updateCompanyProfile } from "@/graphql/mutations/company";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  linksState,
  popoverState,
} from "../../../utils/recoil_store/atoms/toolsAtom";
import Popover from "@/components/company/pop-over";
import Play from "@/assests/icons/play-icon.svg";
import DeleteSocialMediaLink from "@/components/company/delete-social-media";
import { awsUpload } from "@/aws/awsUpload";
import { useLinksState } from "../../../utils/recoil_store/hooks/use-link-state";
import { TempGetUser } from "@/graphql/queries/user";
import useUser from "utils/recoil_store/hooks/use-user-state";
import { notifyErrorFxn, notifySuccessFxn } from "../../../utils/toast-fxn";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCloseOutline } from "react-icons/io5";
import { Organization } from "./organization.interface";
import { ClipLoader } from "react-spinners";

type Props = {};

const Company = (props: Props) => {
  const { links, deleteLink, setLinks } = useLinksState();
  const [rawVideo, setRawVideo] = useState<File | null>(null);
  const [rawImage, setRawImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedIndustry, setSelectedIndustry] =
  //   useState("");
  const [selectedIndustryDropdown, setSelectedIndustryDropdown] =
    useState(false);
  const [selectedRoleDropdown, setSelectedRoleDropdown] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [popover, setPopover] = useRecoilState(popoverState);
  const [hovered, setHovered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  // const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  //getting user data
  const { userState: userProp, updateUser } = useUser();
  const userState = userProp?.currentUser;

  const newLink = links.map(({ __typename, ...rest }) => rest);
  // const defaultCompanyData = {
  //   name: "",
  //   companyWebsite: "",
  //   description: "",
  //   industry: "",
  //   introVideo: "",
  //   logo: "",
  //   _id: "",
  //   socialMedia: [],
  // };

  const [companyData, setCompanyData] = useState<Organization | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState(
    userState?.organization?.industry || ""
  );

  useEffect(() => {
    setCompanyData(userState?.organization);
  }, [userState]);

  useEffect(() => {
    if (userState?.organization) {
      setSelectedIndustry(userState.organization.industry || "");
    }
  }, [userState]);

  const selectUserbuttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectUserbuttonRef.current &&
        !selectUserbuttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSelectedIndustryDropdown(false);
        setRotated(false);
        setIsRotated(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectOptionStyle: React.CSSProperties = {
    color: selectedIndustry === "" ? "#363641" : "#282833",
  };

  const toggleUserDropdown = () => {
    setIsRotated(!isRotated);
    setSelectedIndustryDropdown(!selectedIndustryDropdown);
    if (selectedRoleDropdown) {
      setSelectedRoleDropdown(false);
      setRotated(false);
    }
  };

  const handleOptionClick = (option: React.SetStateAction<string>) => {
    setSelectedIndustry(option);
    setSelectedIndustryDropdown(false);
    setIsRotated(false);
  };

  const handleFileUpload = async (file: any, dirName: string) => {
    const fileName = sanitizeFileName(file.name);
    const newFile = new File([file], fileName, { type: file.type });

    try {
      const data = await awsUpload({
        file: newFile,
        fileName: fileName,
        dirName: dirName,
      });
      return data.location;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Error uploading file");
    }
  };
  // const [popover, setPopover] = useRecoilState(popoverState);

  // const { refetch } = useQuery(TempGetUser, {
  //   onCompleted: (data) => {
  //     setCompanyData(userState?.organization);
  //     setCompanyLogo(userState?.organization.logo);
  //     setIntroVideo(userState?.organization.introVideo);
  //     setSelectedIndustry(userState?.organization.industry);
  //   },
  // });

  const { refetch } = useQuery(TempGetUser, {
    onCompleted: (data) => {
      const organization = userState?.organization;

      setCompanyData(organization);
      setSelectedIndustry(organization?.industry || "");

      // Batch the logo and video state updates to avoid extra renders
      React.startTransition(() => {
        setCompanyLogo(organization?.logo);
        setIntroVideo(organization?.introVideo);
      });
    },
  });

  const [companyLogo, setCompanyLogo] = useState(userState?.organization?.logo);
  const [introVideo, setIntroVideo] = useState(
    userState?.organization?.introVideo
  );

  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (companyData) {
  //     setCompanyLogo(companyData?.logo);
  //     setIntroVideo(companyData?.introVideo);
  //     formik.setValues({
  //       coyName: companyData?.name || "",
  //       coyWebsite: companyData?.companyWebsite || "",
  //       description: companyData?.description || "",
  //       industry: companyData?.industry || "",
  //     });
  //     setLoading(false);

  //     setLinks((prevLinks) => [...companyData.socialMedia]);
  //   }
  // }, [companyData, setLinks, formik]);

  const [updateCoyProfile, {}] = useMutation(updateCompanyProfile, {
    onCompleted: (data) => {
      notifySuccessFxn("updated successfully");
    },
    onError: (error) => {
      notifyErrorFxn(error.message);
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    // Check the description before proceeding
    // if (formik.values.description === "<p></p>" || formik.values.description.trim() === "") {
    //   setIsLoading(false);
    //   // notifyErrorFxn("Company Description is required."); // Show error message
    //   setDescriptionError("Company Description is required.")
    //   return;
    // }

    let introVideoUrl = "";
    let logoUrl = "";

    try {
      if (rawVideo) {
        introVideoUrl = await handleFileUpload(rawVideo, "intro_video");
        console.log("Uploaded intro video:", introVideoUrl);
      }

      if (rawImage) {
        logoUrl = await handleFileUpload(rawImage, "company_logo");
        console.log("Uploaded logo:", logoUrl);
      }
      console.log(formik.values);

      await updateCoyProfile({
        variables: {
          input: {
            companyName: formik.values.coyName,
            companyIndustry:
              selectedIndustry === ""
                ? formik.values.industry
                : selectedIndustry,
            companyWebsite: formik.values.coyWebsite,
            companyDescription: formik.values.description,
            companyIntroVideo: introVideoUrl,
            companyLogo: logoUrl,
            socialMedia: newLink,
          },
        },
      });

      // Create a deep copy of the user state to update
      const updatedUser = userProp instanceof Object ? { ...userProp } : {};

      if (updatedUser?.currentUser instanceof Object) {
        updatedUser.currentUser = { ...updatedUser.currentUser };

        if (updatedUser.currentUser.organization instanceof Object) {
          // Create a proper deep copy of the organization object
          updatedUser.currentUser.organization = {
            ...updatedUser.currentUser.organization,
            logo: logoUrl || companyLogo,
            introVideo: introVideoUrl || introVideo,
            industry:
              selectedIndustry === ""
                ? formik.values.industry
                : selectedIndustry,
            name: formik.values.coyName,
            companyWebsite: formik.values.coyWebsite,
            description: formik.values.description,
            socialMedia: newLink,
          };
        }
      }

      // Update the Recoil state with the complete updated user object
      updateUser(updatedUser);

      refetch();
    } catch (error) {
      console.error("Submission Error: ", error);
      notifyErrorFxn("An error occurred during submission!");
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      coyName: companyData?.name || "",
      coyWebsite: companyData?.companyWebsite || "",
      description: companyData?.description || "",
      industry: companyData?.industry || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      coyName: Yup.string().required("Company Name is required"),
      coyWebsite: Yup.string().required("Company website is required"),
      description: Yup.string().required("Company Description is required"),
    }),
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (!companyData) return; // Exit early if no data

    setCompanyLogo((prev: any) =>
      prev !== companyData.logo ? companyData.logo : prev
    );
    setIntroVideo((prev: any) =>
      prev !== companyData.introVideo ? companyData.introVideo : prev
    );

    formik.setValues({
      coyName: companyData?.name || "",
      coyWebsite: companyData?.companyWebsite || "",
      description: companyData?.description || "",
      industry: companyData?.industry || "",
    });

    setLoading(false);
    setLinks((prevLinks) => [...companyData.socialMedia]);
  }, [companyData]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setRawImage(file);
      const imageUrl = URL.createObjectURL(file);
      setCompanyLogo(imageUrl);
    }
  };

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setRawVideo(file);
      const videoUrl = URL.createObjectURL(file);
      setIntroVideo(videoUrl);

      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoMouseOver = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.muted = true;
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const handleVideoMouseOut = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      setIsVideoPlaying(false);
    }
  };

  const handleImageUploadDrop = async (file: File) => {
    if (!file) {
      notifyErrorFxn("No file selected");
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      notifyErrorFxn("Invalid file type. Only jpg, jpeg, png are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      notifyErrorFxn("File size exceeds 2MB.");
      return;
    }

    try {
      setRawImage(file); // Set the raw image file
      const data = await awsUpload({
        file,
        fileName: file.name,
        dirName: `profile_images/`, // Directory name where the image is uploaded
      });

      console.log("data dddd:", data?.location);

      notifySuccessFxn("Image uploaded successfully!");
      setCompanyLogo(data.location); // Set the AWS URL of the uploaded image
      setImageError(null); // Clear any error
    } catch (error) {
      notifyErrorFxn("Error uploading image!");
      console.error("Error uploading file:", error);
    }
  };

  const handleVideoUploadDrop = async (file: File) => {
    if (!file) {
      notifyErrorFxn("No file selected");
      return;
    }

    // Check file size and type
    if (file.size > 50 * 1024 * 1024) {
      notifyErrorFxn("File size exceeds 50MB.");
      return;
    }

    const videoUrl = URL.createObjectURL(file);
    setRawVideo(file); // Set raw video for upload
    setIntroVideo(videoUrl); // Preview video
  };

  const handleIndustryChange = (selectedOption: { value: any }) => {
    formik.setFieldValue("industry", selectedOption.value);
  };

  const handleEditorChange = (richText: any) => {
    // if (descriptionError) {
    //   setDescriptionError(null)
    // }
    formik.setFieldValue("description", richText);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <ClipLoader color="#282833" size={"5vh"} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full w-full relative">
      <ToastContainer />
      <nav className="flex items-center w-full py-[1.04vw] pl-[1.56vw] pr-[1.30vw] border-b-[0.05vw] border-[#E0E0E9]">
        <div className="flex flex-col items-start p-0">
          <h2 className="text-[1.30vw] font-switzer font-semibold text-left text-very-dark-grayish-blue leading-[1.63vw]">
            Company Profile
          </h2>
          <p className="text-[0.88vw] font-normal  text-left text-grayish-blue mt-[0.58vw]">
            This is information about you, you can change your information here.
          </p>
        </div>
      </nav>
      <div className="h-[70vh] overflow-y-scroll scrollbar-thin">
        <div className="px-[1.56vw] pt-[1.56vw] w-full relative ">
          <div className="grid grid-cols-2 gap-[1.15vw]">
            <div>
              <h4 className="mb-[1.3vw] text-very-dark-grayish-blue text-[1vw] font-semibold">
                Company Logo
              </h4>

              <div
                className="border border-[#c0c0c037] rounded-[0.78vw] h-[18.54vw] flex items-center justify-center relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setHovered(true);
                }} // Prevent default to allow drop
                onDragLeave={() => setHovered(false)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setHovered(false);
                  const file = e.dataTransfer.files[0]; // Get the dropped file
                  // if (file)
                  if (file && file.type.startsWith("image/")) {
                    await handleImageUploadDrop(file); // Handle the image upload
                  }
                }}>
                {/* bg-white/30 */}
                {companyLogo && isHovered && (
                  <div className="absolute top-[0.5vw] right-[0.5vw] flex !items-center !justify-center h-[2.2vw] w-[2.2vw] !bg-[#ffffff] backdrop-blur-md rounded-full border border-white/50 shadow-md hover:shadow-lg hover:bg-white/80 transition-all duration-300 cursor-pointer z-50">
                    <IoCloseOutline
                      onClick={() => setCompanyLogo("")}
                      size={20}
                      className="cursor-pointer hover:text-[red] transition-colors duration-300"
                    />
                  </div>
                )}

                {companyLogo ? (
                  <Image
                    src={companyLogo}
                    alt="Uploaded Image"
                    layout="fill"
                    objectFit="contain"
                    objectPosition="50% 50%"
                    className="rounded-none w-full h-full cursor-pointer"
                    blurDataURL={`/_next/image?url=${companyLogo}&w=16&q=1`}
                    placeholder="blur"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                    <IoMdImages className="text-gray-400 opacity-30 text-[4.167vw]" />
                    <p className="text-[0.625vw] text-gray-400">
                      Click upload to add company logo
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-[1.04vw] mt-[1.56vw]">
                <label
                  htmlFor="fileUpload"
                  className="flex items-center justify-center h-[2.08vw] w-[4.79vw] text-[#282833B2] text-center text-[0.83vw] font-normal py-[0.52vw] px-[1.04vw] rounded-[0.78vw] cursor-pointer border-[#E0E0E9] border hover:border-[#b4b4c8] hover:bg-[#F4F4FA] hover:text-very-dark-grayish-blue">
                  Upload
                </label>
                <p className="text-[0.83vw] text-center font-normal text-[#6F6F76] h-full">
                  JPG, PNG, SVG
                </p>
                <input
                  id="fileUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="">
              <h4 className="mb-[1.3vw] text-very-dark-grayish-blue text-[1vw] font-semibold">
                Introduction video
              </h4>

              <div
                className="border border-[#c0c0c037] rounded-[0.78vw] h-[18.54vw] flex items-center justify-center relative"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsHovered(true);
                }}
                onDragLeave={() => setIsHovered(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsHovered(false);
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith("video/")) {
                    handleVideoUploadDrop(file);
                  } else {
                    notifyErrorFxn("Please drop a valid video file.");
                  }
                }}>
                {introVideo && hovered && (
                  <div className="absolute top-[0.5vw] right-[0.5vw] flex !items-center !justify-center h-[2.2vw] w-[2.2vw] !bg-[#ffffff] backdrop-blur-md rounded-full border border-white/50 shadow-md hover:shadow-lg hover:bg-white/80 transition-all duration-300 cursor-pointer z-50">
                    <IoCloseOutline
                      onClick={() => setIntroVideo("")}
                      size={20}
                      className="cursor-pointer hover:text-[red] transition-colors duration-300"
                    />
                  </div>
                )}
                {introVideo ? (
                  <div
                    className="relative h-full w-full rounded-[0.78vw]"
                    onMouseOver={handleVideoMouseOver}
                    onMouseOut={handleVideoMouseOut}
                    onClick={handleVideoClick}>
                    <video
                      key={introVideo}
                      controls={isPlaying}
                      ref={videoRef}
                      preload="metadata"
                      className="h-full w-full rounded-[15px] object-cover">
                      <source
                        src={introVideo}
                        type="video/mp4"
                        className="rounded-[15px]"
                      />
                      Your browser does not support the video tag.
                    </video>
                    {!isPlaying && !isVideoPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer rounded-[0.78vw]">
                        <Image
                          className="absolute w-[1.79vw] h-[h-[2.12vw] cursor-pointer"
                          src={Play}
                          alt=""
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center">
                    <FaPhotoVideo className="text-gray-400 opacity-30 text-[4.167vw]" />
                    <p className="text-[0.625vw] text-gray-400">
                      Click upload to add introduction video
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-[1.04vw] mt-[1.56vw]">
                <label
                  htmlFor="videoUpload"
                  className="flex items-center justify-center h-[2.08vw] w-[4.79vw] text-[#282833B2] text-center text-[0.83vw] font-normal py-[0.52vw] px-[1.04vw] rounded-[0.78vw] cursor-pointer border-[#E0E0E9] border hover:border-[#b4b4c8] hover:bg-[#F4F4FA] hover:text-very-dark-grayish-blue">
                  Upload
                </label>
                <p className="text-[0.83vw] text-center font-normal text-[#6F6F76] h-full">
                  Upload Video (50MB max)
                </p>
                <input
                  id="videoUpload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
              </div>
            </div>
          </div>

          <hr className="w-full h-[1px] bg-[#E0E0E9] mt-[1.56vw]" />
        </div>

        <div className="w-full p-[1.56vw]">
          <h2 className="text-[1.30vw] font-switzer font-semibold text-left text-very-dark-grayish-blue leading-[1.63vw]">
            Edit Information
          </h2>
          <form>
            <div className="grid grid-cols-2 gap-[0.89vw] mt-[2.40vw]">
              <div className="w-full">
                <label className="block text-very-dark-grayish-blue text-[0.94vw] mb-[0.9vw] font-semibold">
                  Company Name
                </label>
                <input
                  type="text"
                  name="coyName"
                  placeholder="Enter company name"
                  value={formik.values.coyName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`flex items-center w-full h-[2.55vw] hover:border-[#50589F] placeholder:text-[#6F6F76] placeholder:text-[0.83vw] font-medium text-[0.83vw] px-[0.77vw] py-[0.51vw] border text-very-dark-grayish-blue ${
                    formik.touched.coyName && formik.errors.coyName
                      ? "border-red-500"
                      : "border-[#E0E0E9]"
                  } rounded-[0.78vw] focus:outline-none bg-transparent`}
                />
                {formik.touched.coyName && formik.errors.coyName ? (
                  <div className="text-red-500 text-[0.83vw] mt-1">
                    {formik.errors.coyName}
                  </div>
                ) : null}
              </div>
              <div className="w-full relative">
                <label className="block text-very-dark-grayish-blue text-[0.94vw] mb-[0.9vw] font-semibold">
                  Choose Industry
                </label>
                <button
                  type="button"
                  ref={selectUserbuttonRef}
                  onClick={toggleUserDropdown}
                  className="outline-none w-full h-[2.55vw] hover:bg-[#f4f4fa] p-[0.51225vw_0.768vw] leading-normal text-[0.83vw] text-[#282833] border border-solid border-[#e0e0e9] rounded-[0.78vw] flex items-center justify-between cursor-pointer grow-0 relative">
                  <span
                    className="pointer-events-none text-center flex items-center text-[#363641]"
                    style={selectOptionStyle}>
                    {selectedIndustry || "Select an industry"}
                  </span>

                  <Image
                    className="cursor-pointer w-[0.83vw] h-[0.42vw] transition-transform duration-300"
                    width={16}
                    src={Chevron}
                    style={{
                      transform: isRotated ? "rotate(-180deg)" : "rotate(0deg)",
                    }}
                    alt=""
                  />
                </button>

                {selectedIndustryDropdown && (
                  <ul
                    ref={dropdownRef}
                    className="absolute top-full left-0 w-full flex flex-col items-center p-[0.52vw] gap-[0.52vw] max-h-[10vw] bg-[#ffffff] rounded-[0.78vw] font-normal text-[0.94vw] leading-[120%] flex-none grow-0 order-1  overflow-y-auto scrollbar-gutter-stable z-50"
                    style={selectStyle}>
                    {industries.map((industry) => (
                      <li
                        key={industry.value}
                        onClick={() => handleOptionClick(industry.label)}
                        className="w-full pl-[0.77vw] py-[0.94vw] h-[2.55vw] rounded-[0.78vw] font-normal text-[#282833B2] text-start flex items-center text-[0.94vw] cursor-pointer hover:bg-[#f4f4fa] hover:text-very-dark-grayish-blue hover:w-full">
                        {industry.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className=" w-full mt-[1.2vw]">
              <label className="block mb-[1vw] text-very-dark-grayish-blue text-[0.94vw] font-semibold">
                Company description
              </label>
              <Tiptap
                description={formik.values.description}
                onChange={handleEditorChange}
              />

              {/* {descriptionError ? (
                <div className="text-red-500 text-[0.83vw] mt-1">
                  {descriptionError}
                </div>
              ) : null} */}
            </div>
            <div className="w-full mt-[1.2vw]">
              <label className="block mb-[1vw] text-very-dark-grayish-blue text-[0.94vw] font-semibold">
                Company website
              </label>
              <input
                type="text"
                name="coyWebsite"
                placeholder="Enter company website"
                value={formik.values.coyWebsite}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`flex items-center w-full h-[2.55vw] placeholder:text-[#6F6F76] hover:border-[#50589F] placeholder:text-[0.92vw] font-medium text-[0.92vw] px-[0.77vw] py-[0.51vw] border text-very-dark-grayish-blue ${
                  formik.touched.coyWebsite && formik.errors.coyWebsite
                    ? "border-red-500"
                    : "border-[#E0E0E9]"
                } rounded-[0.78vw] focus:outline-none`}
              />
              {formik.touched.coyWebsite && formik.errors.coyWebsite ? (
                <div className="text-red-500 text-[0.83vw] mt-1">
                  {formik.errors.coyWebsite}
                </div>
              ) : null}
            </div>
            <div className="mt-1 py-4">
              <div className="flex items-center justify-between">
                <label className="block mb-[1vw] text-very-dark-grayish-blue text-[0.94vw] font-semibold">
                  Social Media Links
                </label>
                <h1
                  onClick={() => {
                    setShowModal(true);
                    setPopover((prev) => ({
                      ...prev, // Spread the existing properties
                      url: "", // Update the `url` property to an empty string
                    }));
                  }}
                  className="text-[0.83vw] font-medium text-[#50589F] cursor-pointer mb-4 flex items-center">
                  <FiPlus /> <span>Add New</span>
                </h1>
              </div>
              <div className="relative">
                <SocialMediaLinks data={links} />
                {/* <Popover
                openDelete={() => setIsDeleteOpen(true)}
                openEdit={() => setShowModal(true)}
              /> */}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSubmit}
                type="submit"
                className="cursor-pointer flex justify-center items-center h-[2.60vw] border rounded-[0.78vw] py-[0.68vw] px-[3.72vw] bg-[#50589F] text-[#fff] text-[0.94vw] font-medium hover:bg-[#42498B] disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!formik.values.coyName || !formik.values.coyWebsite}>
                {isLoading ? (
                  <ClipLoader color="#ffffff" size={"1.5vw"} />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <SocialMediaModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDeleteOpen && (
          <DeleteSocialMediaLink
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Company;

const modalStyle: React.CSSProperties = {
  boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.1)",
};

const selectStyle: React.CSSProperties = {
  boxShadow: "0px 0px 20px rgba(80, 88, 159, 0.1)",
  zIndex: 1,
};
