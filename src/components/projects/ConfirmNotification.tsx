import { CircularProgress, styled } from "@mui/material";
import React, { useState } from "react";
import Modal from "../modal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";

const ConfirmNotificationWrapper = styled("div")`
  display: flex;
  height: 100%;
  // justify-content: center;
  // align-items: center;
  // padding: 3rem;
  flex-direction: column;
  // border: 1px solid;

  > h2 {
    font-weight: 600;
    line-height: 2rem;
    font-size: 1.125rem;
    color: #02120d;
    // text-align: center;

    > span {
      // color: #244bb6;
    }
  }

  > span {
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #02120d;
    // text-align: center;
  }
`;
const ConfirmaNotificationBtn = styled("div")`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
  // border: 1px solid;
  width: 100%;
  flex-wrap: wrap;

  > button {
    all: unset;
    cursor: pointer;
    padding: 0.75rem;
    border-radius: 10px;
    border: 1px solid #02120d;
    display: flex;
    justify-content: center;
    // min-width: 156px;
    flex: 1;
    min-width: 120px;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 600;
  }

  > .primary {
    background: #50589f;
    color: #f8f0fb;
    border: 1px solid #50589f;
  }
`;
interface ConfirmNotificationP {
  open: boolean;
  close: (e?: "true" | null | "error" | "loading") => void;
  action: string | undefined;
  actionMessage?: string;
  completeMessage?: string;
  handleConfirm?: () => void;
  onSwitchToArchive?: () => void;
  success?: "true" | null | "error" | "loading";
  selected?: any;
}

const ConfirmNotification: React.FC<ConfirmNotificationP> = ({
  open,
  close,
  action,
  handleConfirm,
  onSwitchToArchive,
  success,
  selected,
}) => {
  const [complete, setComplete] = useState(false);
  const onComplete = () => {
    handleConfirm && handleConfirm();
    setComplete(true);
  };

  const getCompleteMsg = () => {
    let completeMsgHeader = "";
    let completeMsgBody = "";

    switch (action) {
      case "create":
        completeMsgHeader = "You have successfully created a new Project!";
        completeMsgBody = "";
    }
  };

  const getModalImg = () => {
    switch (action) {
      case "archive":
      case "unarchive":
      case "delete":
        return <ArchiveIcon />;
      default:
        return <EditIcon />;
    }
  };
  const handleClose = () => {
    setComplete(false);
    close(success);
  };
  const getMessage = (complete: boolean, success: string) => {
    if (complete) {
      switch (success) {
        case "true":
          return (
            <h2>
              Project {action === "create" && <span>Created!</span>}
              {action === "edit" && <span>Updated!</span>}
              {action === "delete" && <span>Deleted!</span>}
            </h2>
          );
        case "error":
          return <h2>{success === "error" && <span>Action failed!</span>}</h2>;
      }
    } else {
      return (
        <h2>
          {action === "create" && (
            <>
              Are you sure you want to <span>create this Project list?</span>
            </>
          )}
          {action === "edit" && (
            <>
              Are you sure you want to <span>Save all changes Project</span>
            </>
          )}
          {action === "delete" && (
            <>
              Delete {selected?.name?.name || "Project"}?{" "}
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 400,
                  display: "block",
                  marginTop: "0.5rem",
                }}
              >
                (We recommend archiving instead)
              </span>
            </>
          )}
          {action === "archive" && (
            <>
              Are you sure you want to{" "}
              <span>
                Archive {selected?.name?.name || "Project"} from Projects
              </span>
            </>
          )}
          {action === "unarchive" && (
            <>
              Are you sure you want to{" "}
              <span>
                Unarchive {selected?.name?.name || "Project"} from Projects
              </span>
            </>
          )}
        </h2>
      );
    }
  };
  return (
    <Modal
      open={open}
      borderRadius="15px"
      width="25rem"
      handleClose={handleClose}
      actionIcon={getModalImg()}
    >
      <ConfirmNotificationWrapper>
        {success === "loading" ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            {getMessage(complete, success as string)}
            {complete ? (
              <span>
                {success !== "error" &&
                  (action === "create"
                    ? "You have successfully created a new Project!"
                    : "The changes to the list has been made successfully!")}
                {success === "error" && "Something went wrong"}
              </span>
            ) : (
              <span>
                {action === "delete" ? (
                  <>
                    We recommend archiving this project instead of deleting it.
                    Archiving preserves the project data while removing it from
                    active view. You can restore it later if needed.
                  </>
                ) : (
                  "Take a moment to confirm. Are you certain about updating all the changes in this list?"
                )}
              </span>
            )}
            <ConfirmaNotificationBtn>
              <button
                onClick={handleClose}
                className={complete ? "primary" : ""}
              >
                Close
              </button>
              {!complete && (
                <>
                  {action === "delete" && onSwitchToArchive && (
                    <button
                      className="primary"
                      onClick={() => {
                        onSwitchToArchive();
                      }}
                    >
                      Archive Instead
                    </button>
                  )}
                  <button className="primary" onClick={onComplete}>
                    {action === "delete" ? "Delete Anyway" : "Yes, I'm sure."}
                  </button>
                </>
              )}
            </ConfirmaNotificationBtn>
          </>
        )}
      </ConfirmNotificationWrapper>
    </Modal>
  );
};

export default ConfirmNotification;
