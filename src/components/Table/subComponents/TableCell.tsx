import React from 'react';
import { Typography, styled } from '@mui/material';
import { Box } from '@mui/material';

const TableCell = ({ children, displaySx }: any) => {
    return <TableCellWrapper sx={displaySx}>{children}</TableCellWrapper>;
};

export default TableCell;

const TableCellWrapper = styled(Box)(({ theme }) => ({
    fontSize: theme.customs.spacing.rem(1.4),
    lineHeight: theme.customs.spacing.rem(2.0),
    fontWeight: 400,
    color: "#1D2939"
}));
