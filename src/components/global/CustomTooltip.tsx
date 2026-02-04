import React from 'react';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { calculatePxToPercentage } from '@/../utils/cssHelper';
import { styled } from '@mui/material';

const CustomTooltip = ({ title, placement, mb, children }: any) => {
    return (
        <BootstrapTooltip title={title} mb={mb} arrow placement={placement ?? 'top'}>
            {children}
        </BootstrapTooltip>
    );
};

export default CustomTooltip;

const BootstrapTooltip = styled(
    ({ mb, ...props }: TooltipProps & { mb?: number }) => (
        <Tooltip {...props} arrow classes={{ popper: props.className }} />
    ),
)(({ theme, mb }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    '& .MuiTooltip-tooltip': {
        color: '#FFF !important',
        background: '#282833',
        fontFamily: 'Switzer-Variable',
        height: calculatePxToPercentage(40),
        borderRadius: calculatePxToPercentage(16),
        fontSize: calculatePxToPercentage(14),
        lineHeight: calculatePxToPercentage(18.2),
        fontStyle: 'normal',
        fontWeight: 500,
         marginBottom: mb ? `${calculatePxToPercentage(mb)} !important` : `${calculatePxToPercentage(12)} !important`,
        paddingInline: calculatePxToPercentage(10),
        paddingBlock: calculatePxToPercentage(20),
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
    },

    '& .MuiTooltip-arrow::before': {
        background: '#282833 !important',
    },
}));
