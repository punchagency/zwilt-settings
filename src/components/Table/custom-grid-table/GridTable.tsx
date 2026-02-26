import React from "react";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/material";
import { styled } from "@mui/material";
import Typography from "@mui/material/Typography";

interface IGridTable {
  columns: string[];
  gridColumn: string;
  rows?: React.ReactNode;
  headerStyle?: SxProps;
  tableStyle?: SxProps;
}

const GridTable: React.FC<IGridTable> = ({
  columns,
  gridColumn,
  rows,
  headerStyle,
  tableStyle,
}) => {
  return (
    <TableWrapper sx={tableStyle}>
      <TableHeadC grid_column={gridColumn} sx={headerStyle ? headerStyle : {}}>
        {columns.map((el) => (
          <div key={el} className="columnItem">
            <Typography>{el.toUpperCase()}</Typography>
          </div>
        ))}
      </TableHeadC>
      {rows}
    </TableWrapper>
  );
};

export default GridTable;

const TableWrapper = styled(Box)(({}) => ({
  fontFamily: "Cabin",
  width: "100%",
}));

const TableHeadC = styled(Box)<{ grid_column: string }>(({ grid_column }) => ({
  display: "grid",
  gridTemplateColumns: grid_column,
  paddingBottom: "0",
  textAlign: "center",
  borderBottom: "0.5px solid rgba(242, 244, 245,0.1)",
  "& .columnItem": {
    fontSize: "12px",
    lineHeight: "17px",
    marginBottom: "5px",
    width: "70%",
    textAlign: "center",
  },
  // ...headstyle,
}));
