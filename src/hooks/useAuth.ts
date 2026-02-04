import { LOGOUT_USER } from "@/graphql/mutations/user";
// import { clearAuthCookie } from "@/lib/with-apollo";
import { useMutation } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { defaultUserState } from "../../utils/recoil_store/atoms/userAtom";
import useUser from "../../utils/recoil_store/hooks/use-user-state";
import { useState } from "react";
import { socket } from "../lib/external-socket";

const useAuth = () => {
  const router = useRouter();
  const { updateUser, userState } = useUser();
  const [fetchLogout, {}] = useMutation(LOGOUT_USER);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleLogout = async () => {
    try {
      console.log({ userState }, "logout");
      const punchId = userState?.currentUser?.user?.punchId;

      const logout = await fetchLogout();
      if (logout.data?.logout?.success) {
        setShowSuccessMessage(true);
        socket.emit("logout", punchId);
        router.push(
          `${process.env.NEXT_PUBLIC_STORE_APP}/auth/signin?v=account&r=settings`
        );
        sessionStorage.removeItem("zw_in");
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("zw_us");
          window.localStorage.removeItem("recoil-persist");
        }
        updateUser(defaultUserState);
      }
    } catch (error) {
      //   notifyErrorFxn(`An error occurred while trying to Logout ${error}`);
    }
  };

  return { handleLogout, showSuccessMessage };
};

export default useAuth;
