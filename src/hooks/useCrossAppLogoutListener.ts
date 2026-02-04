import { useEffect } from "react";

import { useRouter } from "next/router";
import useUser from "utils/recoil_store/hooks/use-user-state";
import { socket } from "@/lib/external-socket";

const useCrossAppLogoutListener = () => {
  const { userState, updateUser } = useUser();
  const router = useRouter();
  //const { handleLogout } = useLogout();
  const punchId = userState?.currentUser?.user?.punchId;

  useEffect(() => {
    const handleUserLoggedOut = (data: { userId: string }) => {
      console.log("Received logout event for user:", data.userId);
      if (data.userId === punchId) {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("zw_us");
          window.localStorage.removeItem("recoil-persist");
        }
        router.push(
          `${process.env.NEXT_PUBLIC_STORE_APP}/auth/signin?v=account&r=settings`
        );
      }
    };

    socket.on(`${punchId}-userLoggedOut`, handleUserLoggedOut);

    return () => {
      socket.off(`${punchId}-userLoggedOut`, handleUserLoggedOut);
      // closeSocket();
    };
  }, [router, punchId]);

  return null;
};

export default useCrossAppLogoutListener;
