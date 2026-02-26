import React, { PropsWithChildren } from "react";
import Modal from "../modal";
import { Box, Button, styled } from "@mui/material";

import CustomDropdown from "../dropdown/CustomDropdown";
import ConfirmNotification from "../projects/ConfirmNotification";

import { GET_PROJECTS } from "@/graphql/queries/user";
import { ADD_PROJECT_MEMBER } from "@/graphql/mutations/user";
import { useLazyQuery, useQuery, useMutation } from "@apollo/react-hooks";
import userAtom from "@/atoms/user-atom";
import { useRecoilState } from "recoil";

const NewProjectModalContent = styled("div")`
  margin-top: 1rem;
`;

const NewProjectModalBtn = styled("div")`
// margin-top: 3rem;
display: flex;
justify-content: flex-end;
gap: 1rem;

> button {
  all: unset;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #02120d;
  // min-width: 120px;
  display: flex;
  justify-content: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  cursor: pointer;
}

> .primary {
  background: #50589F;
  color: #f8f9fb;
  border: 1px solid #50589F;
  font-weight: 600;
}
`;

interface IDialogBox extends PropsWithChildren {
  handleClose: () => void;
  open: boolean;
  selectedUser: string;
  onUpdate: () => void;
  title: string;
  actionText: string;
  height?: string;
}

const DialogBox: React.FC<IDialogBox> = ({
  handleClose,
  open,
  children,
  onUpdate,
  title,
  actionText,
  height
}) => {
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [selectedProjects, setSelectedProjects] = React.useState<(string | number)[]>([]);
  const [user, setUser] = useRecoilState(userAtom);
  const closeConfirmModal = () => {
    setOpenConfirmModal(false);
  };
  

  return (
    <Modal
      handleClose={handleClose}
      open={open}
      borderRadius="15px"
      title={title}
      width="30rem"
      height={height}
    >
      <NewProjectModalContent>
        {/* <ConfirmNotification
          action={"edit"}
          open={openConfirmModal}
          close={closeConfirmModal}
          onConfirm={()=>{}}
        /> */}
        {children}
        <NewProjectModalBtn>
        <button onClick={handleClose}>Cancel</button>
          <button
          disabled={false}
            className="primary"
            onClick={() => {
              // addProjectMember();
              setOpenConfirmModal(true);
              onUpdate();
            }}
          >
            {actionText}
          </button>
         
        </NewProjectModalBtn>
      </NewProjectModalContent>
    </Modal>
  );
};

export default DialogBox;

const ModalButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#244BB6",
  padding: theme.customs.spacing.rem(0.8, 1.5),
  borderRadius: theme.customs.spacing.rem(0.8),
  fontFamily: "inter",
}));
