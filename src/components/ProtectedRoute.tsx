"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useUser from "utils/recoil_store/hooks/use-user-state";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { userState } = useUser();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!userState?.currentUser) {
      return; // Wait until user data is available
    }

    if (userState.currentUser.clientAccountType !== "ADMIN") {
      router.replace("/");
    } else {
      setIsAuthorized(true);
    }
  }, [userState, router]);

  // Prevent flash by returning null until authorization is confirmed
  if (isAuthorized === null) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
