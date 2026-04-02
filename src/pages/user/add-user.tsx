"use client";
import React, { useEffect } from "react";
import AddUserForms from "@/components/user/add-user";
import AddUserHeading from "@/components/user/add-user/add-user-heading";
import { useRecoilState } from "recoil";
import userAtom from "@/atoms/user-atom";
import { useRouter } from "next/router";

const AddUserPage = () => {
  const [user] = useRecoilState(userAtom);
  const router = useRouter();

  useEffect(() => {
    const userRole = user?.userData?.role;
    if (
      userRole &&
      !["ORGANIZATION_MANAGER", "ORGANIZATION_OWNER"].includes(userRole)
    ) {
      router.push("/dashboard");
    }
  }, [user?.userData?.role, router]);

  return (
    <div>
      <AddUserHeading />
      <AddUserForms />
    </div>
  );
};

AddUserPage.requireAuth = true;

export default AddUserPage;
