import React from 'react';
import { Typography, styled } from '@mui/material';
import { Box } from '@mui/material';
import TableRow from './TableRow';
import TableCell from './TableCell';
import { TableData } from '../Table';

const TableBody: React.FC<TableData> = ({ data, keys }) => {
    // console.log(keys, 'table keys');
    return (
        <TableBodyWrapper>
            {data.map((row, index) => (
                <TableRow
                    key={index}
                    padding={true}
                    borderBottom={index === data.length - 1 ? false : true}
                >
                    {keys.map((key, index) => (
                        <TableCell
                            key={index}
                            displaySx={{
                                flex: `${key !== 'project' ? key !== 'date' ? 2 : 3  : 4}`,
                            }}
                        >
                            {row[key]}
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBodyWrapper>
    );
};

export default TableBody;

const TableBodyWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    // padding: theme.customs.spacing.rem(1.5),
}));
