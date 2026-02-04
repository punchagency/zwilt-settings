"use client";
import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { sideBarArray } from "@/arrays/SideBarArray";
import { useRouter } from "next/router";
import useUser from "utils/recoil_store/hooks/use-user-state";

const SideBar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const [isActive, setIsActive] = useState<string>("");

  // Memoize sidebar items to avoid re-renders
  const memoizedSideBarArray = useMemo(() => sideBarArray, []);

  //getting user data
  const { userState: userProp } = useUser();
  const userState = userProp?.currentUser;
  const logo = userState?.organization?.logo;
  // Handler to navigate to the clicked item
  const handleNavigation = useCallback(
    async (href: string, name: string) => {
      setIsActive(name);
      await router.push(href); // Navigate to the route immediately
    },
    [router]
  );

  return (
    <div>
      {memoizedSideBarArray.map((item) => {
        if (
          item.name === "Manage Team" &&
          userState.clientAccountType !== "ADMIN"
        )
          return null;

        return (
          <div
            key={item.name}
            onClick={() => handleNavigation(item.href, item.name)}
            className={`group flex items-center justify-start text-[#696970] font-normal text-[0.83vw] py-[0.67vw] px-[0.52vw] w-[16.14vw] h-[3.474vw] overflow-hidden cursor-pointer mb-[5px]  ${
              isActive === item.name || currentPath === item.href
                ? "bg-[#F4F4FA] h-full text-[#282833] font-normal"
                : "text-[#696970]"
            } hover:bg-[#F4F4FA] hover:text-[#282833] h-full text-[0.83vw] rounded-[0.78vw]`}
          >
            <div className="group flex items-center justify-between w-full gap-[2px]">
              <div className="flex items-center justify-start gap-[0.52vw] text-[0.83vw]">
                <Image
                  src={item.icon}
                  alt={item.name}
                  className={`w-[1.25vw] h-[1.25vw] fill-current ${
                    isActive === item.name || currentPath === item.href
                      ? "fill-current text-[#282833]"
                      : "text-[#696970]"
                  } group-hover:text-[#282833]`}
                />
                <p
                  className={`text-[0.83vw] font-normal ${
                    isActive === item.name || currentPath === item.href
                      ? "text-[#282833]"
                      : "text-[#696970]"
                  } group-hover:text-[#282833]`}
                >
                  {item.name}
                </p>
              </div>

              {item.name === "Company Profile" && (
                <div className="">
                  {logo ? (
                    <Image
                      src={logo}
                      alt="Company Logo"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    item.icon2
                  )}
                </div>
              )}
              {/* {item.icon2 && <div className="">{logo}</div>} */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SideBar;
