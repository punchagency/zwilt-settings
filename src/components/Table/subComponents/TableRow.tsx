import React from 'react';
import { Typography, styled, useTheme } from '@mui/material';
import { Box } from '@mui/material';

const TableRow = ({ children, borderBottom, padding }: any) => {
    const theme = useTheme()
    return (
        <TableRowWrapper
            sx={{
                borderBottom: borderBottom ? `${theme.customs.spacing.rem(0.1)} solid #EAECF0` : undefined,
                padding: padding ? `${theme.customs.spacing.rem(1.8, 0, 2.0, 0)}` : undefined,
            }}
        >
            {children}
        </TableRowWrapper>
    );
};

export default TableRow;

const TableRowWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
}));
