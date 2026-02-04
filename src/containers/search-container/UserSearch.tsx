import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useUser from "utils/recoil_store/hooks/use-user-state";
import defaultImage from "@/assests/images/profile.jpg";
import Image from "next/image";

interface userProps {
  searchQuery: string;
  setIsFocus: any;
  setSearchQuery: any;
  setEmpty: any;
}

interface userArray {
  name: string;
  email: string;
  phone: string;
}

const UserSearch: React.FC<userProps> = ({
  searchQuery,
  setIsFocus,
  setSearchQuery,
  setEmpty,
}) => {
  const { userState: userProp } = useUser();
  const router = useRouter();
  const userState = userProp?.currentUser?.user;
  const [userArray, setUserArray] = useState<userArray | null>(null);
  const [sortData, setSortData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    setUserArray(userState);
  }, [userState]);

  useEffect(() => {
    if (
      sortData.email === "" &&
      sortData.name === "" &&
      sortData.phone === ""
    ) {
      setEmpty(true);
    } else {
      setEmpty(false);
    }
  }, [sortData]);

  const handleNavigate = () => {
    router.push("/user");
    setIsFocus(false);
    setSearchQuery("");
  };

  useEffect(() => {
    if (searchQuery.length === 0) {
      setSortData((prev) => ({
        ...prev,
        name: "",
      }));
      setEmpty(false);
    } else if (
      userArray?.name
        .toLocaleLowerCase()
        .includes(searchQuery.toLocaleLowerCase())
    ) {
      setSortData((prev) => ({
        ...prev, // Spread the previous state object to keep other properties
        name: userArray?.name, // Update the name property
      }));
      setEmpty(true);
    } else {
      setSortData((prev) => ({
        ...prev,
        name: "",
      }));
    }
  }, [searchQuery, userArray?.name, setEmpty]);

  useEffect(() => {
    if (searchQuery.length === 0) {
      setSortData((prev) => ({
        ...prev,
        email: "",
      }));
    } else if (
      userArray?.email
        .toLocaleLowerCase()
        .includes(searchQuery.toLocaleLowerCase())
    ) {
      setSortData((prev) => ({
        ...prev, // Spread the previous state object to keep other properties
        email: userArray?.email, // Update the name property
      }));
    } else {
      setSortData((prev) => ({
        ...prev,
        email: "",
      }));
    }
  }, [searchQuery, userArray?.name, userArray?.email, userArray?.phone]);

  useEffect(() => {
    if (searchQuery.length === 0) {
      setSortData((prev) => ({
        ...prev,
        phone: "",
      }));
    } else if (userArray?.phone?.includes(searchQuery)) {
      setSortData((prev) => ({
        ...prev, // Spread the previous state object to keep other properties
        phone: userArray?.phone, // Update the name property
      }));
    } else {
      setSortData((prev) => ({
        ...prev,
        phone: "",
      }));
    }
  }, [searchQuery, userArray?.name, userArray?.email, userArray?.phone]);

  if (sortData.email === "" && sortData.name === "" && sortData.phone === "") {
    return null;
  }

  return (
    <div className="pt-[0.83vw] border-t">
      <p className=" font-[600] text-[0.93vw] ">User Profile</p>
      {sortData.name !== "" && (
        <div
          onClick={handleNavigate}
          className="flex items-center gap-[0.63vw] h-fit p-[0.83vw] hover:bg-[#f4f4fa] cursor-pointer rounded-[0.73vw]"
        >
          <Image
            src={userState?.profile_img ?? defaultImage}
            alt="team"
            height={40}
            width={40}
            className="w-[2.08vw] h-[2.08vw] rounded-full "
          />
          <div>
            <p className="font-[500] text-[0.93vw] ">{sortData.name}</p>
            <p className="text-[0.73vw] text-gray-500">User Profile</p>
          </div>
        </div>
      )}
      {sortData?.email !== "" && (
        <div
          onClick={handleNavigate}
          className="flex flex-col h-fit p-[0.83vw] hover:bg-[#f4f4fa] cursor-pointer rounded-[0.73vw]"
        >
          <p className="font-[500] text-[0.93vw] ">{sortData.email}</p>
          <p className="text-[0.73vw] text-gray-500">User Profile</p>
        </div>
      )}
      {sortData?.phone !== "" && (
        <div
          onClick={handleNavigate}
          className="flex flex-col h-fit p-[0.83vw] hover:bg-[#f4f4fa] cursor-pointer rounded-[0.73vw]"
        >
          <p className="font-[500] text-[0.93vw] ">{sortData.phone}</p>
          <p className="text-[0.73vw] text-gray-500">User Profile</p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
