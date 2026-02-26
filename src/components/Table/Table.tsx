import React, { useState } from "react";
import { styled, Typography } from "@mui/material";
import { Box } from "@mui/material";
import TableTabs from "./subComponents/TableTabs";
import { tabs } from "./constants/tabs";
import TableHeader from "./subComponents/TableHeader";
import { headers, rows } from "./constants/tableData";
import TableBody from "./subComponents/TableBody";

import Logo from "@/assets/img/Logo.png";
import Image from "next/image";

export interface TableData {
  keys: string[];
  data: any[];
}

const Table: React.FC<TableData> = ({ data, keys }) => {
  let modifiedData = data.map((row) => ({
    ...row,
    project: (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "8px",
            // justifyContent: "center",
          }}
        >
          <Image src={Logo} alt="project logo" />
          {row.project}
        </Box>
      </>
    ),
  }));
  return (
    <TableWrapper>
      <TableContent>
        <TableHeader headers={keys} />
        <TableBody data={modifiedData} keys={keys} />
      </TableContent>
    </TableWrapper>
  );
};

export default Table;

const TableWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  //   border: "1px solid #EBEBEB",
  borderRadius: theme.customs.spacing.rem(0.7),
}));

const TableTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  // border: '1px solid green',
}));

const TableContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  // padding: `${theme.customs.spacing.rem(1.6)} ${theme.customs.spacing.rem(
  //     1.4,
  // )} ${theme.customs.spacing.rem(0)} ${theme.customs.spacing.rem(1.6)}`,
  //   border: "1px solid yellow",
}));
