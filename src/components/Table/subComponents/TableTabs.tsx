import React from 'react';
import { Typography, styled } from '@mui/material';
import { Box } from '@mui/material';
import TabItem from './TabItem';

interface ITabItem {
    id: number;
    title: string;
    active: boolean;
}

interface ITableTabs {
    tabs: ITabItem[];
    onTabItemClick: (id: number) => void;
}

const TableTabs: React.FC<ITableTabs> = ({ tabs, onTabItemClick }) => {
    return (
        <Wrapper>
            {tabs.map((tab, index) => (
                <TabItemWrapper key={index} onClick={(e) => onTabItemClick(tab.id)}>
                    <TabItem title={tab.title} active={tab.active} />
                </TabItemWrapper>
            ))}
        </Wrapper>
    );
};

export default TableTabs;

const Wrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    borderBottom: '1px solid #EBEBEB',
}));

const TabItemWrapper = styled(Box)(({ theme }) => ({
    cursor: 'pointer',
}));
