import { calculatePxToPercentage } from '@/../utils/cssHelper';

export const scrollBarStylesGlobal = {
    
    '&::-webkit-scrollbar': {
        width: calculatePxToPercentage(6),
    },
    '&::-webkit-scrollbar-track': {
        background: ' #f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#D1D1DB',
        bordeRadius: calculatePxToPercentage(6),
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#555',
    },
    '&::-webkit-scrollbar-corner': {
        background: '#f1f1f1',
    },
    /* for Firefox */
    '&.scrollbar': {
        width: calculatePxToPercentage(6),
    },
    '&.scrollbar-track': {
        background: '#f1f1f1',
    },

    '&.scrollbar-thumb': {
        background: '#D1D1DB',
        borderRadius: calculatePxToPercentage(5),
    },

    '&.scrollbar-thumb:hover': {
        background: '#555',
    },

    '&.scrollbar-corner': {
        background: '#f1f1f1',
    },
    '&:hover': {
        '&::-webkit-scrollbar-thumb': {
            background: '#D1D1DB',
        },
    },
};

export const scrollBarStylesGlobal2 = {
    '&::-webkit-scrollbar': {
        width: calculatePxToPercentage(6),
    },
    '&::-webkit-scrollbar-track': {
        background: '#FFFFFF',
    },

    '&::-webkit-scrollbar-thumb': {
        background: '#FFFFFF',
        // background: '#D1D1DB',
        bordeRadius: calculatePxToPercentage(6),
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#555',
    },
    '&::-webkit-scrollbar-corner': {
        background: '#f1f1f1',
    },
    /* for Firefox */
    '&.scrollbar': {
        width: calculatePxToPercentage(6),
    },
    '&.scrollbar-track': {
        background: '#f1f1f1',
    },

    '&.scrollbar-thumb': {
        background: '#D1D1DB',
        borderRadius: calculatePxToPercentage(5),
    },

    '&.scrollbar-thumb:hover': {
        background: '#555',
    },

    '&.scrollbar-corner': {
        background: '#f1f1f1',
    },
    '&:hover': {
        '&::-webkit-scrollbar-thumb': {
            background: '#D1D1DB',
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
        },
    },
};


export const scrollBarStylesHover = {
    overflowY: 'hidden',
    position: 'relative',
    paddingRight: calculatePxToPercentage(10),

    '&:hover': {
        overflowY: 'auto',
        paddingRight: calculatePxToPercentage(4),
        '&::-webkit-scrollbar-thumb': {
            background: '#D1D1DB',
        },
    },
    /* Scrollbar styles */
    '&::-webkit-scrollbar': {
        width: calculatePxToPercentage(6),
        position: 'absolute',
        right: 0,
        zIndex: 1,
    },
    '&::-webkit-scrollbar-track': {
        background: ' #f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#D1D1DB',
        borderRadius: calculatePxToPercentage(6),
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#555',
    },
};
