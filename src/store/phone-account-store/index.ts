import { CityOption } from "@/components/phone_account/AddPhoneModal";
import { create } from "zustand";

interface ICity {
  showCityDetail: boolean;
  selectedCity: CityOption | null;
  selectedCityId: string;

  setShowCityDetails: (shouldShow: boolean) => void;
  // setSelectedCity: (data: any) => void;
  setSelectedCityId: (id: string) => void;
}

export const usePhoneInfo = create<ICity>((set) => ({
  showCityDetail: false,
  selectedCity: null,
  selectedCityId: "",

  setShowCityDetails: (shouldShow: boolean) =>
    set((state: any) => ({ showCityDetail: shouldShow })),
  // setSelectedCity: (data: any) => set((state: any) => ({ selectedCity: data })),
  setSelectedCityId: (id: string) =>
    set((state: any) => ({ selectedCityId: id })),
}));

interface IEdit {
  showEdit: boolean;

  setShowEdit: (shouldShow: boolean) => void;
}
interface IDelete {
  showDelete: boolean;

  setShowDelete: (shouldShow: boolean) => void;
}

export const useEdit = create<IEdit>((set) => ({
  showEdit: false,

  setShowEdit: (shouldShow: boolean) =>
    set((state: any) => ({ showEdit: shouldShow })),
}));
interface IDelete {
  showDelete: boolean;
  setShowDelete: (shouldShow: boolean) => void;
}

export const useDeleteAccount = create<IDelete>((set) => ({
  showDelete: false,

  setShowDelete: (shouldShow: boolean) =>
    set((state: any) => ({ showDelete: shouldShow })),
}));
