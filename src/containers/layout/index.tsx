import React, { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import SideBar from "@/components/SideBar";
import useUser from "../../../utils/recoil_store/hooks/use-user-state";
import { ClipLoader } from "react-spinners";
import ChatMiniBox from "@/components/ChatMiniBox";
import { useRouter } from "next/router";
import useCrossAppLogoutListener from "@/hooks/useCrossAppLogoutListener";

export default function AppLayout({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: any;
}) {
  const { updateUser, userState } = useUser();
  const [dismiss, setDismiss] = useState<boolean>(false);
  const router = useRouter();
  useCrossAppLogoutListener();
  const currentUsers = 10;
  const maxUsers = 20;

  useEffect(() => {
    updateUser({ currentUser });
  }, [currentUser, updateUser]);

  return (
    <div className="bg-[#F4F4FA] max-w-full w-full" style={{ height: "100vh" }}>
      <Header />
      <div className="flex py-[0.8vh] pb-4 justify-center gap-[0.83vw] relative max-w-full w-full h-full max-h-screen overflow-hidden">
        {/* sidebar component */}
        {/* py-[1.6vh] px-[0.83vw] */}
        {/* bg-[#FFFFFFE5] */}
        {/* <div
          className="bg-white w-[17.71vw] h-[44.27vw] rounded-[1.56vw] p-[0.78vw] p-[0.83vw] overflow-y-scroll no-scrollbar flex flex-col justify-between cursor-pointer" */}

        {/* h-[85vh] */}
        {!router?.pathname.includes("/chat") && (
          <div
            className="bg-white w-[17.71vw] rounded-[1.56vw] p-[0.78vw] cursor-pointer"
            style={sideBarStyle}
          >
            <SideBar />
            {/* <BasicPlan /> */}
            {!dismiss && (
              <div className="flex items-end justify-end  mt-4">
                {/* <BasicPlan
                currentUsers={currentUsers}
                maxUsers={maxUsers}
                setDismiss={() => setDismiss(true)}
              /> */}
              </div>
            )}
          </div>
        )}
        {/* pages layout */}
        {/* h-[78.70vh] */}
        {userState ? (
          <div
            className={
              router?.pathname.includes("/chat")
                ? "  w-[80vw] !overflow-y-hidden overflow-y-auto scrollbar-gutter-stable"
                : " bg-white w-[75.26vw] rounded-[1.56vw] !overflow-y-hidden overflow-y-auto scrollbar-gutter-stable"
            }
            style={{
              width: router?.pathname.includes("/chat") ? "100vw" : undefined,
              height: "83.5%",
            }}
          >
            {children}
            <ChatMiniBox />
          </div>
        ) : (
          <ClipLoader color="#ffffff" size={"5vw"} />
        )}
      </div>
    </div>
  );
}

const sideBarStyle: React.CSSProperties = {
  border: "1px solid #ffffff",
  backdropFilter: "blur(5px)",
  height: "83.5%",
};
