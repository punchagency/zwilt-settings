import React, { useEffect } from "react";
import { useRouter } from "next/router";
import AppLayout from "./AppLayout";
import Head from "next/head";
import AuthLayout from "./AuthLayout";
import { NextPage } from "next";
import useLogin from "@/hooks/auth/use-login";
import Loader from "../common/Loader/Loader";

type Page = {
  isNoLayoutWrapper?: boolean;
  children: any;
  layoutType?: "fullWidth" | "normal";
};

const Layout = ({ isNoLayoutWrapper, layoutType, ...otherProps }: Page) => {
  console.log(isNoLayoutWrapper, layoutType, "layout type");
  const { pathname } = useRouter();
  const { getUserState, updateUserState } = useLogin();
  const user = getUserState();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {pathname.includes("auth") ? (
        <AuthLayout>{otherProps?.children}</AuthLayout>
      ) : (
        <>
          {isNoLayoutWrapper ? (
            <>{otherProps?.children}</>
          ) : (
            <AppLayout layoutType={layoutType}>
              {otherProps?.children}
            </AppLayout>
          )}
        </>
      )}
    </>
  );
};

export default Layout;
