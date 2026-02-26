import React from 'react';
import { Typography, styled } from '@mui/material';
import { Box } from '@mui/material';

interface ITabItem {
    title: string;
    active: boolean;
}

const TabItem: React.FC<ITabItem> = ({ title, active }) => {
    return active ? (
        <ActiveTabTextWrapper>
            <ActiveTabText>{title}</ActiveTabText>
        </ActiveTabTextWrapper>
    ) : (
        <TabTextWrapper>
            <TabText>{title}</TabText>
        </TabTextWrapper>
    );
};

export default TabItem;

const TabTextWrapper = styled(Typography)(({ theme }) => ({
    padding: theme.customs.spacing.rem(1.2),
    paddingLeft: theme.customs.spacing.rem(1.6),
}));

const ActiveTabTextWrapper = styled(Typography)(({ theme }) => ({
    padding: theme.customs.spacing.rem(1.2),
    borderBottom: `${theme.customs.spacing.rem(0.2)} solid #50589F`,
    paddingLeft: theme.customs.spacing.rem(1.6),
}));

const TabText = styled(Typography)(({ theme }) => ({
    fontSize: theme.customs.spacing.rem(1.6),
    lineHeight: theme.customs.spacing.rem(2.1),
    fontWeight: 600,
    color: '#151A22',
}));

const ActiveTabText = styled(Typography)(({ theme }) => ({
    fontSize: theme.customs.spacing.rem(1.4),
    lineHeight: theme.customs.spacing.rem(1.8),
    fontWeight: 500,
    color: '#151A22',
}));
