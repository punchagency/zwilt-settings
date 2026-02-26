import { Modal as MuiModal } from "@mui/material";
import { styled } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
// import { StaticImport } from "next/dist/shared/lib/get-img-props";
import type { StaticImageData as StaticImport } from "next/image";

import { useEffect, useRef, useState } from "react";

interface ModalProps {
  handleClose?: () => void;
  open: boolean;
  children: JSX.Element;
  width?: string;
  headerImgUrl?: React.ReactNode;
  borderRadius?: string;
  position?: {
    right?: string;
    top?: string;
  };
  height?: string;
  title?: string;
  subtitle?: string;
  closeBtn?: boolean;
  actionBtn?: boolean;
  actionIcon?: React.ReactNode;
  addPadding?: boolean;
}

interface ModalContentProps {
  width?: string;
  customStyle?: any;
  borderRadius?: string;
  position?: {
    right?: string;
    top?: string;
  };
  height?: string;
  title?: string;
  subtitle?: string;
  closeBtn?: boolean;
  addPadding?: boolean;
  headerHeight?: number;
}

const ModalContent = styled("div")<ModalContentProps>(
  ({ width, borderRadius, position, height, addPadding, headerHeight }) => `
  position: absolute;
  top: ${position?.top !== undefined ? position.top : "50%"} ;
  left: ${position?.right !== undefined ? "unset" : "50%"};
  right: ${position?.right};
  transform: ${
    position?.right !== undefined ? "unset" : "translate(-50%, -50%)"
  };
  width: ${width || "726px"}; 
  background: white;
  padding: 1rem;
  border-radius: ${borderRadius || "1rem"};
padding: ${addPadding ? "1.5rem" : undefined};
// max-height: ${height};
height: ${height || "auto"};
max-width: 100%;
// border: 1px solid green;

> .modal-content-wrapper {
  height: calc(100% - 2.1rem);
  padding-bottom: 1rem;
  // border: 1px solid red;
  // overflow: hidden;
}

overflow-y: auto;

/* for webkit-based browsers */
::-webkit-scrollbar {
  // width: 5px;
  display:none;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

::-webkit-scrollbar-corner {
  background: #f1f1f1;
}

/* for Firefox */
.scrollbar {
  width: 5px;

}

.scrollbar-track {
  background: #f1f1f1;

}

.scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

.scrollbar-thumb:hover {
  background: #555;
}

.scrollbar-corner {
  background: #f1f1f1;
}
`,
);

const TitleWrapper = styled("div")`
  font-family: inter;
  font-size: 1.2rem;
  line-height: 1.2rem;
  font-weight: 600;
  color: #02120d;
  // position: absolute;
  // top: 0;
  // left: 0;
`;
const SubTitleWrapper = styled("div")`
  font-family: inter;
  font-size: 1rem;
  line-height: 1.875rem;
  font-weight: 500;
  color: #02120d;
  opacity: 0.5;
  // position: absolute;
  // top: 0;
  // left: 0;
`;

const TiltesCon = styled("div")`
  display: flex;
  width: 100%;
  // border:1px solid red;
  flex-direction: column;
  justify-content: center;

  // position: absolute;
  // top: 0;
  // left: 0;
`;

const CloseBtn = styled("button")`
  outline: unset;
  border: unset;
  padding: 0;
  background: transparent;
  cursor: pointer;
  width: 1.5rem;
  // display: block;
  // border: 1px solid;
  // position: relative;

  > img {
    width: 100%;
  }
`;
const ActionBtn = styled("button")`
  outline: unset;
  border: unset;
  padding: 0;
  background: transparent;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
`;

const ModalContentHeader = styled("div")`
  width: 100%;
  position: relative;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;

  > img {
    width: 2rem;
  }
`;

const Modal: React.FC<ModalProps> = ({
  open,
  handleClose,
  children,
  width,
  position,
  borderRadius,
  height,
  title,
  subtitle,
  headerImgUrl,
  actionIcon,
  actionBtn = true,
  closeBtn = true,
  addPadding,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [heightState, setHeightState] = useState(0);

  useEffect(() => {
    if (divRef.current) {
      const height = divRef.current.offsetHeight;
      console.log("height", height);
      setHeightState(height);
    }
  }, []);
  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <ModalContent
        width={width}
        position={position}
        borderRadius={borderRadius}
        height={height}
        addPadding={addPadding}
        headerHeight={heightState}
      >
        <ModalContentHeader>
          <TiltesCon>
            {title && <TitleWrapper>{title}</TitleWrapper>}
            {subtitle && <SubTitleWrapper>{subtitle}</SubTitleWrapper>}
          </TiltesCon>
          {actionBtn && actionIcon && <ActionBtn>{actionIcon}</ActionBtn>}
          {handleClose && closeBtn && (
            <CloseBtn onClick={handleClose}>
              <CloseIcon />
            </CloseBtn>
          )}
        </ModalContentHeader>
        <div className="modal-content-wrapper">{children}</div>
      </ModalContent>
    </MuiModal>
  );
};

export default Modal;
