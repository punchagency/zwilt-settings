import { atom } from "recoil";

export const userEmailToAssign = atom({
    key: 'userEmailToAssign',
    default: '',
})

export const confirmDeleteIcon = atom({
    key: 'confirmDeleteIcon',
    default: false
})

export const userEmailToDelete = atom({
    key: "userEmailToDelete",
    default: ""
})

