import React, { useEffect, useState } from "react";
import useUser from "utils/recoil_store/hooks/use-user-state";
import AppLayout from ".";

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { updateUser } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token =
          typeof window !== "undefined" ? localStorage.getItem("zw_us") : null;
        const parsedToken = token ? JSON.parse(token) : null;

        const baseUrl =
          process.env.NEXT_PUBLIC_APP_SERVER || "http://localhost:5005";
        const response = await fetch(`${baseUrl}/api/v1/identity/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(parsedToken?.token && { "x-auth-token": parsedToken.token }),
          },
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData?.message || "Failed to fetch user");
        }

        const rawData = responseData?.data;

        let responseUser = null;
        let organization = null;

        // Use the user data returned from the REST API
        if (rawData?.user) {
          responseUser = rawData.user;
          organization = rawData.organization;
        }
        setUserData(
          !responseUser
            ? null
            : {
                user: responseUser,
                organization: organization,
              },
        );
        setLoading(false);

        if (!responseUser) {
          window.location.href = `${process.env.NEXT_PUBLIC_STORE_APP}/auth/signin?v=account&r=settings`;

          if (typeof window !== "undefined") {
            window.localStorage.removeItem("recoil-persist");
            window.localStorage.clear();
          }
        } else {
          updateUser({
            currentUser: {
              user: responseUser,
              organization: organization
            }
          });
        }
      } catch (err: any) {
        setLoading(false);
        setError(err);
        setUserData(null);

        // Redirect to signin if authentication fails
        if (typeof window !== "undefined") {
          window.location.href = `${process.env.NEXT_PUBLIC_STORE_APP}/auth/signin?v=account&r=settings`;
        }
      }
    };

    fetchData();
  }, [updateUser]);

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
