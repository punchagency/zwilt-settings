"use client";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import human from "../../assests/images/human.webp";

const Page: React.FC = () => {
  const defaultImage = human as unknown as string; // Ensure defaultImage is a string
  const [profileImage, setProfileImage] = useState<string>(defaultImage);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>(""); // Initialize phone state with an empty string
  const [teamRole, setTeamRole] = useState<string>(" ");
  const [countryCode, setCountryCode] = useState<any>(undefined); // Initialize countryCode state with undefined

  useEffect(() => {
    fetch("https://ipinfo.io/json?token=fb7087013ded88")
      .then((response) => response.json())
      .then((data) => {
        if (data.country) {
          setCountryCode(data.country.toUpperCase());
        }
      })
      .catch((error) => {
        console.error("Error fetching IP information:", error);
      });
  }, []);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, etc.).");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      } else {
        alert("Error reading file.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    console.log({
      profileImage,
      firstName,
      lastName,
      email,
      phone,
      teamRole,
    });
  };

  return (
    <div className="">
      <div className="user-profile">
        <h2 className="user">User Profile</h2>
        <p className="info">
          This is information about you, you can change your information here.
        </p>
        <hr className="line" />
        <div className="profile-container">
          <div className="profile-image">
            <label className="profile-label">Profile Image</label>
            <Image
              src={profileImage}
              alt="Profile"
              width={150}
              height={150}
              className="profile-pic"
            />
            <div className="upload-container">
              <label htmlFor="fileUpload" className="upload">
                Upload
              </label>
              <p className="max-size">Max Size 600x600px</p>
            </div>
            <input
              type="file"
              accept="image/*"
              id="fileUpload"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
          <div className="form-container">
            <div className="form-row">
              <div className="form-group">
                <label className="first">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label className="last">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="email">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label className="phone">Phone</label>
                <PhoneInput
                  defaultCountry={countryCode}
                  value={phone}
                  onChange={(value) => setPhone(value || "")}
                  className="input-field"
                  international
                  withCountryCallingCode
                />
              </div>
            </div>
            <div className="teamro">
              <label className="Team">Team Role</label>
              <input
                type="text"
                value={teamRole}
                onChange={(e) => setTeamRole(e.target.value)}
                className="input-field"
                style={{ width: "97.5%" }}
              />
            </div>
            <div className="button-container">
              <button onClick={handleSave} className="save-button">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
