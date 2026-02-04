import { useLazyQuery } from "@apollo/react-hooks";

import React, { useEffect, useState } from "react";
import { TempGetUser } from "@/graphql/queries/user";
import useUser from "utils/recoil_store/hooks/use-user-state";
import AppLayout from ".";

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { updateUser } = useUser();
  const [userData, setUserData] = useState(null);

  const [fetchUser, { loading }] = useLazyQuery(TempGetUser, {
    fetchPolicy: "network-only",
  });
  const fetchData = async () => {
    try {
      const { data } = await fetchUser();
      const responseUser = data?.getUser?.data?.client;
      setUserData(!responseUser ? null : responseUser);
      if (!responseUser) {
        window.location.href = `${process.env.NEXT_PUBLIC_STORE_APP}/auth/signin?v=account&r=settings`;

        if (typeof window !== "undefined") {
          window.localStorage.removeItem("recoil-persist");
          window.localStorage.clear();
        }
      } else {
        updateUser({ currentUser: responseUser });
      }
    } catch (error) {
      console.log("Error getting user data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return loading || !userData ? (
    <></>
  ) : (
    <AppLayout currentUser={userData}>{children}</AppLayout>
  );
};

export default AuthGuard;
