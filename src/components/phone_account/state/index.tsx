import { ReactiveVar, makeVar } from "@apollo/client";

export const selectedCityVar: ReactiveVar<any> = makeVar<any>(null);
export const shouldRefetchVar: ReactiveVar<boolean> = makeVar<boolean>(false);
