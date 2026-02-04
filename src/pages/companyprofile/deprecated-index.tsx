import React, { useState } from "react";
import Image from "next/image";
import nologoImg from "@/assests/images/nologo.png";

const CompanyProfile: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(
    "https://www.pngitem.com/pimgs/m/355-3559795_placeholder-image-logo-svg-hd-png-download.png"
  );
  const [video, setVideo] = useState<string | null>(
    "https://www.w3schools.com/html/mov_bbb.mp4"
  ); // Placeholder video

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFile(url);
    }
  };

  return (
    <div className="max-w-full w-full">
      <div className="w-full py-[1.04vw] pl-[1.56vw] border-b-[0.05vw] border-[#E0E0E9]">
        <h2 className="text-[1.25vw] font-switzer font-semibold text-left text-[#282833] leading-[1.63vw]">
          Company Profile
        </h2>
        <p className="text-[0.83vw] font-medium leading-[1.08vw] text-left text-[#98A2B3] mt-[0.52vw]">
          This is information about you, you can change your information here.
        </p>
      </div>
      {/* <hr className="hori" /> */}

      <div className="profile-section">
        <div className="logo-upload">
          <h4 className="comp">Company Logo</h4>
          {nologoImg ? (
            <Image
              src={nologoImg}
              alt="Company Logo"
              className="uploaded-logo"
              width={100}
              height={100}
            />
          ) : (
            <div className="upload-placeholder">
              <p>Upload your logo</p>
            </div>
          )}
          <div className="upload-container">
            <label htmlFor="logoUpload" className="upload-button1">
              Upload
            </label>
            <input
              type="file"
              accept="image/*"
              id="logoUpload"
              onChange={(e) => handleFileUpload(e, setLogo)}
              style={{ display: "none" }}
            />
            <p className="image">JPG, PNG, SVG</p>
          </div>
        </div>

        <div className="video-upload">
          <h4 className="videe">Introduction Video</h4>
          {video ? (
            <video controls className="uploaded-video">
              <source src={video} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="upload-placeholder">
              <p>Upload your introduction video</p>
            </div>
          )}
          <div className="upload-container">
            <label htmlFor="videoUpload" className="upload-button2">
              Upload
            </label>
            <input
              type="file"
              accept="video/*"
              id="videoUpload"
              onChange={(e) => handleFileUpload(e, setVideo)}
              style={{ display: "none" }}
            />
            <p className="vid">Upload Video (&lt;50MB)</p>
          </div>
        </div>
      </div>
      <hr className="line" />
      <div className="edit-info">
        <h3 className="edit">Edit Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company-name" className="company">
              Company Name
            </label>
            <input
              className="companytext"
              type="text"
              id="company-name"
              placeholder="Enter company name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="industry" className="industry">
              Choose Industry
            </label>
            <select id="industry" className="in">
              <option value="" className="ind">
                Select industry
              </option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
