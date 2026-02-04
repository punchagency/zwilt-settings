import { REMOVE_2FA } from "@/graphql/mutations/settings";
import { useMutation } from "@apollo/client";
import useUser from "utils/recoil_store/hooks/use-user-state";
import { notifyErrorFxn, notifySuccessFxn } from "utils/toast-fxn";

const useDisable2Fa = () => {
  const { userState: userProp, updateUser } = useUser();

  const [disable2FA] = useMutation(REMOVE_2FA, {
    onCompleted: () => {
      let user = userProp instanceof Object ? { ...userProp } : {};
      if (user?.currentUser?.user instanceof Object) {
        user.currentUser = { ...user.currentUser };
        user.currentUser.user = {
          ...user.currentUser.user,
          isAuthenticatorEnabled: false,
          isTwoFactorEnabled: false,
          isPhoneTwoFactorEnabled: false,
        };

        updateUser(user);
      }
      notifySuccessFxn("Two Factor Authentication Successfully deactivated");
    },
    onError: (err) => {
      notifyErrorFxn("Error deactivating  2FA:" + err?.message);
      throw "Error deactivating";
    },
  });

  return { disable2FA };
};

export default useDisable2Fa;
