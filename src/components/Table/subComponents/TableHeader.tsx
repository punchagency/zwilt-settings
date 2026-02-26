import React from 'react';
import { Typography, styled } from '@mui/material';
import { Box } from '@mui/material';
import TableRow from './TableRow';

interface ITableHeader {
    headers: string[];
}

const TableHeader: React.FC<ITableHeader> = ({ headers }) => {
    console.log(headers, 'table data');
    return (
        <TableHeaderWrapper>
            <TableRow>
                {headers.map((header, index) => (
                    <HeaderTextWrapper
                        sx={{
                            flex: `${
                                header.toLocaleLowerCase() !== 'project' ? header.toLocaleLowerCase() !== 'date' ? 2 : 3 : 4
                            }`,
                        }}
                        key={index}
                    >
                        <HeaderText>{header}</HeaderText>
                    </HeaderTextWrapper>
                ))}
            </TableRow>
        </TableHeaderWrapper>
    );
};

export default TableHeader;

const TableHeaderWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    // border: '1px solid #EBEBEB',
    // backgroundColor: '#FCFCFC',
    // borderRadius: theme.customs.spacing.rem(0.7),
    // padding: theme.customs.spacing.rem(1.5),
}));

const HeaderTextWrapper = styled(Box)(({ theme }) => ({}));

const HeaderText = styled(Typography)(({ theme }) => ({
    fontSize: theme.customs.spacing.rem(1.4),
    lineHeight: theme.customs.spacing.rem(2.0),
    fontWeight: 500,
    // textTransform: 'uppercase',
    color: '#02120D',
}));
