import React, { useEffect, useState } from "react";
import Modal from "../modal";
import { styled } from "@mui/material";
import ConfirmNotification from "./ConfirmNotification";

interface ExternalActionModalI {
  open: boolean;
  handleClose: () => void;
  unselectBtn: () => void;
  firstBtn: () => void;
  firstBtnText: string;
  deleteBtn: () => void;
  selected: number;
  actionSuccess?: "true" | "error" | undefined | "loading";
  title?: string;
  showModal?: boolean;
}

const ExternalActionModalContent = styled("div")`
  display: flex;
  align-items: center;
  gap: 7rem;
  padding: 1rem 1.5rem;
`;

const ExternalActionModalBtnWrapper = styled("div")`
  display: flex;
  gap: 2rem;
  border-left: 1px solid #b4bbc640;
  padding-left: 2rem;
  > button {
    all: unset;
    display: flex;
    padding: 0.5rem 1.5rem;
    align-items: center;
    border-radius: 12px;
    gap: 12px;
    cursor: pointer;
  }
  > .archive {
    background: #244bb61a;
    color: #244bb6;
  }

  > .delete {
    background: #ed4d2e1a;
    color: #ed4d2e;
  }
`;

const ItemSelectWrapper = styled("div")`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  min-width: 292px;

  > span {
    color: #02120d;
  }

  > button {
    all: unset;
    font-weight: 500;
    color: #ed4d2e;
    cursor: pointer;
  }
`;

const ExternalActionModal: React.FC<ExternalActionModalI> = ({
  open,
  handleClose,
  selected,
  unselectBtn,
  firstBtnText,
  firstBtn,
  deleteBtn,
  actionSuccess,
  title = "Project ",
  showModal = "true",
}) => {
  const [action, setAction] = useState<"archive" | "delete">();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [success, setSuccess] = useState<"true" | "error" | null>();
  const closeConfirmModal = () => {
    setOpenConfirmModal(false);
    setConfirm(false);
    handleClose();
  };
  const onArchive = () => {
    setAction("archive");
    if (!showModal) {
      firstBtn();
    } else {
      setOpenConfirmModal(true);
    }
  };

  const onDelete = () => {
    setAction("delete");
    if (!showModal) {
      deleteBtn();
    } else {
      setOpenConfirmModal(true);
    }
  };

  useEffect(() => {
    if (confirm && action) {
      if (action === "archive") {
        firstBtn();
      } else if (action === "delete") {
        deleteBtn();
      }
      setAction(undefined);
      setConfirm(false);
      handleClose();
    }
  }, [action, confirm]);
  return (
    <Modal
      handleClose={handleClose}
      open={open}
      borderRadius="15px"
      width="auto"
      closeBtn={false}
      position={{ top: "20%" }}
    >
      <ExternalActionModalContent>
        <ConfirmNotification
          action={action}
          open={openConfirmModal}
          close={closeConfirmModal}
          handleConfirm={() => setConfirm(true)}
          success={actionSuccess}
        />
        <ItemSelectWrapper>
          <span>
            {selected} {title} Selected
          </span>
          <button onClick={unselectBtn}>Unselect All</button>
        </ItemSelectWrapper>
        <ExternalActionModalBtnWrapper>
          <button className="archive" onClick={onArchive}>
            {firstBtnText}
          </button>
          <button className="delete" onClick={onDelete}>
            Delete
          </button>
        </ExternalActionModalBtnWrapper>
      </ExternalActionModalContent>
    </Modal>
  );
};

export default ExternalActionModal;
