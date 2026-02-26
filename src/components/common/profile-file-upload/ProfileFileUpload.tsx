import React from "react";
import { styled } from "@mui/material";
import palettes from "@/constants/palettes";

type TAProfileFileUpload = {
  onFileChange: (event: any) => Promise<void>;
};

const ProfileFileUpload = ({ onFileChange }: TAProfileFileUpload) => {
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    onFileChange(event);
  };
  return (
    <div>
      <input
        type="file"
        id="uploadFile"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <label htmlFor="uploadFile">
        <UploadBtn>Update Profile Picture</UploadBtn>
      </label>
    </div>
  );
};

export default ProfileFileUpload;

const UploadBtn = styled("div")(({ theme }) => ({
  borderRadius: "0.625rem",
  padding: "0.75rem 1.875rem",
  fontWeight: 500,
  textAlign: "center",
  border: `1px solid ${palettes?.dark[1]}`,
}));
