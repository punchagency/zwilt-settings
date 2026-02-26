import { IObjectWithAnyKeys } from "./types/global";

export const excludeObjectKeys = (obj: IObjectWithAnyKeys, keys: string[]) => {
  let result = { ...obj };

  if (keys.length) {
    for (const key of keys) {
      if (result[key] !== undefined) {
        delete result[key];
      }
    }
  }

  return result;
};

export const getObjectSlice = (obj: IObjectWithAnyKeys, keys: string[]) => {
  let result: IObjectWithAnyKeys | null = null;

  if (!keys.length) {
    return obj;
  }

  result = {};
  for (const key of keys) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }

  return result;
};
