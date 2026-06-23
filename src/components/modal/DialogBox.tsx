import React, { PropsWithChildren } from "react";
import Modal from "../modal";
import { styled } from "@mui/material";
import { useRecoilState } from "recoil";
import userAtom from "@/atoms/user-atom";

const NewProjectModalContent = styled("div")`
  margin-top: 1rem;
`;

const NewProjectModalBtn = styled("div")`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  > button {
    all: unset;
    padding: 0.5rem 0.9rem;
    border-radius: 8px;
    border: 1px solid #02120d;
    display: flex;
    justify-content: center;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    cursor: pointer;
  }

  > .primary {
    background: #50589f;
    color: #f8f9fb;
    border: 1px solid #50589f;
    font-weight: 600;
  }

  > button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface IDialogBox extends PropsWithChildren {
  handleClose: () => void;
  open: boolean;
  selectedUser: string; // Maintain for compatibility if needed, though unused here
  onUpdate: () => void;
  title: string;
  actionText: string;
  height?: string;
  isLoading?: boolean;
}

const DialogBox: React.FC<IDialogBox> = ({
  handleClose,
  open,
  children,
  onUpdate,
  title,
  actionText,
  height,
  isLoading,
}) => {
  const [, setUser] = useRecoilState(userAtom); // Maintain consistent state hook usage

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
        {children}
        <NewProjectModalBtn>
          <button onClick={handleClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className="primary"
            disabled={isLoading}
            onClick={() => {
              onUpdate();
            }}
          >
            {isLoading ? "Saving..." : actionText}
          </button>
        </NewProjectModalBtn>
      </NewProjectModalContent>
    </Modal>
  );
};

export default DialogBox;
