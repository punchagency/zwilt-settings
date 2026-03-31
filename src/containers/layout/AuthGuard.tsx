import { useLazyQuery } from "@apollo/react-hooks";

import React, { useEffect, useState } from "react";
import { TempGetUser } from "@/graphql/queries/user";
import useUser from "utils/recoil_store/hooks/use-user-state";
import AppLayout from ".";

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { updateUser } = useUser();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const [fetchUser, { loading }] = useLazyQuery(TempGetUser, {
    fetchPolicy: "network-only",
  });
  useEffect(() => {
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
      } catch (err: any) {
        console.log("Error getting user data", err);
        setError(err);
        setUserData(null);
      }
    };

    fetchData();
  }, [fetchUser, updateUser]);

  if (loading) return <></>;

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">
            Backend Connection Error
          </h2>
          <p className="text-gray-600 mt-2">
            Could not connect to{" "}
            {process.env.NEXT_PUBLIC_ZWILT_SERVER || "the backend server"}.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userData) return <></>;

  return <AppLayout currentUser={userData}>{children}</AppLayout>;
};

export default AuthGuard;
