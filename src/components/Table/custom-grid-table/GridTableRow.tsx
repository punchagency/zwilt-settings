import CustomButton from "@/components/buttons/CustomButton";
import { SxProps } from "@mui/material";
import React from "react";
import { styled } from "@mui/material";

interface IGridTableRow {
  rowItems?: any[];
  wrapperStyle?: SxProps;
  hasButton?: boolean;
  buttonText?: string;
  buttonAction?: () => {};
  gridColumn: string;
  customComponent?: React.ReactNode;
  innerWrapperStyle: SxProps;
}
const GridTableRow: React.FC<IGridTableRow> = ({
  rowItems,
  wrapperStyle,
  hasButton,
  buttonText = "Review",
  buttonAction = () => {},
  gridColumn,
  customComponent,
  innerWrapperStyle,
}) => {
  return (
    <RowOuterWrapper>
      <InnerRowWrapper sx={innerWrapperStyle}>
        <RowWrapper sx={wrapperStyle} grid_column={gridColumn}>
          {rowItems?.map((item, index) => (
            <ItemWrapper key={index} className="rowitem">
              {item}
            </ItemWrapper>
          ))}

          {hasButton && (
            <ItemWrapper className="rowitem">
              <ButtonGroup className="buttonitem">
                {customComponent ? (
                  customComponent
                ) : (
                  <CustomButton variant="contained" onClick={buttonAction} />
                )}
              </ButtonGroup>
            </ItemWrapper>
          )}
        </RowWrapper>
      </InnerRowWrapper>
    </RowOuterWrapper>
  );
};

const RowOuterWrapper = styled("div")(() => ({
  //   padding: "0 14px 0 34px",
}));

const InnerRowWrapper = styled("div")(() => ({
  padding: "0 10px 0 10px",
  "&:hover": {
    backgroundColor: "#FCFCFC",
    border: "1px solid rgb(242, 244, 245, 0.1)",
    borderRadius: "15px",
  },
}));

const RowWrapper = styled("div")<{ grid_column: string }>(
  ({ grid_column }) => ({
    display: "grid",
    gridTemplateColumns: grid_column,
    width: "100%",
    alignItems: "center",
    padding: "20px 0",
    borderBottom: "0.5px solid rgba(242, 244, 245,0.1)",
    fontFamily: "Cabin",
    fontSize: "16px",
    lineHeight: "19px",
    fontWeight: "400",
    color: "#BBBBBF",
    // ...(wrapperstyle ? wrapperstyle : {}),
  })
);

const ItemWrapper = styled("div")(() => ({
  width: "70%",
}));

const ButtonGroup = styled("div")(() => ({
  display: "flex",
  alignContent: "baseline",
  gap: "10px",
}));

export default GridTableRow;
