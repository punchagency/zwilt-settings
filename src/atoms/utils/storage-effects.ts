import { AtomEffect } from "recoil";
import { excludeObjectKeys, getObjectSlice } from "@/utils/global";
import { IObjectWithAnyKeys } from "@/types/global";
import { decryptData, encryptData } from "@/utils/crypto";

type StorageType = "LOCAL" | "SESSION";

export interface IStorageProps {
  key: string;
  include?: string[];
  exclude?: string[];
  storageType?: StorageType;
  databaseHandler?: {
    getter: (obj: Record<string, any>) => Promise<Record<string, any>>;
    setter: (obj: Record<string, any>) => Promise<void>;
  };
}

export const storageEffect =
  ({
    key,
    include = [],
    exclude = [],
    storageType = "LOCAL",
    databaseHandler,
  }: IStorageProps): AtomEffect<IObjectWithAnyKeys> =>
  ({ setSelf, onSet, trigger }) => {
    if (typeof window !== "undefined") {
      let storage = sessionStorage;

      if (storageType === "SESSION") {
        storage = sessionStorage;
      }
      // If there's a persisted value - set it on load
      const loadPersisted = async () => {
        const savedValue = storage.getItem(key);
        if (savedValue != null) {
          let parsedData = decryptData(savedValue);
          if (databaseHandler) {
            parsedData = await databaseHandler.getter(parsedData);
          }

          setSelf((prev) => ({
            ...prev,
            ...parsedData,
          }));
        }
      };

      // Asynchronously set the persisted data
      if (trigger === "get") {
        loadPersisted();
      }

      onSet(async (newValue, _, isReset) => {
        if (isReset) {
          storage.removeItem(key);
        } else {
          const included = getObjectSlice(newValue, include);
          const excluded = excludeObjectKeys(included, exclude);
          storage.setItem(key, encryptData(excluded));
          if (databaseHandler) {
            await databaseHandler.setter(newValue);
          }
        }
      });
    }
  };
