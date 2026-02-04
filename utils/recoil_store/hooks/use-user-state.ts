import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";

const useUser = () => {
  const [recoilState, setRecoilState] = useRecoilState(userAtom);
  const [userState, setUserState] = useState(recoilState);

  type IUserState = typeof userState;
  type IUserStateKey = keyof IUserState;
  type IPartialUserState = {
    [Property in IUserStateKey]?: IUserState[Property];
  };
  type IRoleId = {
    role: { _id: number };
  };

  const updateUser = useCallback(
    (update: IPartialUserState) => {
      setRecoilState((prev) => ({
        ...prev,
        ...update,
      }));
    },
    [setRecoilState]
  );

  const getUserState = useCallback(
    (key?: IUserStateKey) => {
      if (key) {
        return userState[key];
      }
      return userState;
    },
    [userState]
  );

  useEffect(() => {
    setUserState(recoilState);
  }, [recoilState]);

  return useMemo(
    () => ({
      userState,
      updateUser,
      getUserState,
    }),
    [userState, updateUser, getUserState]
  );
};

export default useUser;
