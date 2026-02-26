import { Box, Button, styled, Typography } from "@mui/material";
import React, { ReactComponentElement, ReactNode, useState } from "react";
import Modal from "../modal";

interface IDialogMessage extends React.PropsWithChildren {}

interface IMainMessage extends React.PropsWithChildren {
  textColor?: string;
}

export const DialogMessage: React.FC<IDialogMessage> = ({ children }) => {
  return <>{children}</>;
};

export const MainMessage: React.FC<IMainMessage> = ({
  children,
  textColor,
}) => {
  return <MainMessageText color={textColor}>{children}</MainMessageText>;
};

export const MainMessageBlue: React.FC<IMainMessage> = ({ children }) => {
  return <BlueText>{children}</BlueText>;
};

export const NewLine: React.FC = ({}) => {
  return <NewLineElem />;
};

export const SubMessage: React.FC<IMainMessage> = ({ children, textColor }) => {
  return <SubMessageText>{children}</SubMessageText>;
};

interface IConfirmDialogBox {
  open: boolean;
  close: () => void;
  accept?: () => void;
  cancel?: () => void;
  ok?: () => void;
  buttonAcceptText?: string;
  buttonAcceptColor?: string;
  buttonCancelText?: string;
  buttonOK?: boolean;
  mainMessage: ReactNode;
  subMessage: ReactNode;
  headerImgUrl?: React.ReactNode;
}

const ConfirmDialogBox: React.FC<IConfirmDialogBox> = ({
  open,
  close,
  accept,
  cancel,
  mainMessage,
  subMessage,
  buttonAcceptText,
  buttonAcceptColor,
  buttonCancelText,
  buttonOK,
  ok,
  headerImgUrl,
}) => {
  const [complete, setComplete] = useState(false);
  const onComplete = () => {
    if (accept) accept();
    setComplete(true);
  };
  return (
    <Modal
      open={open}
      width="25rem"
      addPadding={false}
      borderRadius="15px"
      handleClose={cancel}
      headerImgUrl={headerImgUrl}
    >
      <DialogBoxLayout>
        <MessageWrapper>
          {mainMessage}
          {subMessage}
        </MessageWrapper>
        <DialogButtonsWrapper>
          {buttonCancelText && (
            <DialogBoxButton
              showBorder={true}
              bgColor="#FFF"
              onClick={() => {
                if (cancel) cancel();
              }}
            >
              <ButtonText bgColor="#101828">{buttonCancelText}</ButtonText>
            </DialogBoxButton>
          )}
          {buttonAcceptText && (
            <DialogBoxButton
              bgColor={buttonAcceptColor}
              onClick={() => {
                if (accept) accept();
              }}
            >
              <ButtonText>{buttonAcceptText}</ButtonText>
            </DialogBoxButton>
          )}
          {buttonOK && (
            <DialogBoxButton
              onClick={() => {
                if (ok) ok();
              }}
            >
              <ButtonText>Close</ButtonText>
            </DialogBoxButton>
          )}
        </DialogButtonsWrapper>
      </DialogBoxLayout>
    </Modal>
  );
};

export default ConfirmDialogBox;

interface IButton {
  bgColor?: string;
  showBorder?: boolean;
}

interface IMainMessageText {
  textColor?: string;
}

const DialogBoxLayout = styled("div")(({ theme }) => ({
  background: "#FFFFFF",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  // margin: "0 auto",
  // padding: theme.customs.spacing.rem(4.8),
  // border: "1px solid blue",
}));

const MessageWrapper = styled("div")(({ theme }) => ({
  background: "#FFFFFF",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  // textAlign: "center",
  marginBottom: theme.customs.spacing.rem(6.4),
  // border: "1px solid red",
}));

const MainMessageText = styled(Typography)<IMainMessageText>(
  ({ theme, textColor }) => ({
    fontFamily: "inter",
    fontSize: "1.125rem",
    lineHeight: "1.75rem",
    // textAlign: "center",
    fontWeight: 600,
    marginBottom: theme.customs.spacing.rem(1.6),
    // color: textColor ? textColor : undefined,
    color: "#101828",
  })
);

const NewLineElem = styled("br")(({ theme }) => ({}));

const SubMessageText = styled(Typography)(({ theme }) => ({
  fontFamily: "inter",
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  // textAlign: "center",
  fontWeight: 400,
}));

const BlueText = styled("span")(({ theme }) => ({
  fontFamily: "inter",
  fontSize: "1.125rem",
  lineHeight: "1.75rem",
  // textAlign: "center",
  fontWeight: 600,
  // color: "#244BB6",
  color: "#101828",
}));

const DialogButtonsWrapper = styled(Box)(({ theme }) => ({
  background: "#FFFFFF",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  gap: theme.customs.spacing.rem(1.6),
  width: "100%",
}));

const DialogBoxButton = styled(Button)<IButton>(
  ({ theme, bgColor, showBorder }) => ({
    border: showBorder
      ? `${theme.customs.spacing.rem(0.1)} solid #101828`
      : undefined,
    borderRadius: theme.customs.spacing.rem(1.0),
    padding: "0.7rem",
    backgroundColor: bgColor ? bgColor : "#50589F",
    fontSize: "1rem",
    textTransform: "none",
    flex: "1",
  })
);

const ButtonText = styled(Typography)<IButton>(({ theme, bgColor }) => ({
  fontFamily: "inter",
  fontSize: theme.customs.spacing.rem(1.6),
  lineHeight: theme.customs.spacing.rem(2.4),
  textAlign: "center",
  fontWeight: 500,
  color: bgColor ? bgColor : "#FAFBFF",
}));
