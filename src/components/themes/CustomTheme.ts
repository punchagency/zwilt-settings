import { Breakpoints, Theme, Components } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import breakpoints from './shared/breakpoints';
import customSpacing, { ICustomSpacing } from './shared/custom-spacing';
// import font from './shared/font';
// import type { IThemeFont } from './shared/font';
import type { IThemeBreakpoints } from './shared/breakpoints';

export interface IThemeCustoms {
    drawer: {
        widthOpen: string;
        widthClose: string;
    };
    header: {
        height: string;
    };
    // font: IThemeFont;
    spacing: ICustomSpacing;
}

export interface ICustomBreakpoints extends Breakpoints {
    values: IThemeBreakpoints;
}

export interface ICustomTheme extends Theme {
    breakpoints: ICustomBreakpoints;
    customs: IThemeCustoms;
    typography: Theme['typography'];
}

const defaultTheme = createTheme();

const customTheme: ICustomTheme = {
    ...defaultTheme,
    breakpoints: {
        ...defaultTheme.breakpoints,
        values: breakpoints,
    },
    typography: {
        ...defaultTheme.typography,
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),

        body1: {
            ...defaultTheme.typography.body1,
            fontFamily: 'Inter',
        },

        body2: {
            ...defaultTheme.typography.body2,
            fontFamily: 'Inter',
        },
        h5: {
            ...defaultTheme.typography.h5,
            fontFamily: 'Inter',
        },
        h6: {
            ...defaultTheme.typography.h6,
            fontFamily: 'Inter',
        },
    },
    components: {
        ...defaultTheme.components,

        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    overflow: 'hidden',
                },
            },
        },
    },
    customs: {
        drawer: {
            widthOpen: customSpacing.rem(27),
            widthClose: customSpacing.rem(8.1),
        },
        header: {
            height: customSpacing.rem(8),
        },
        spacing: customSpacing,
        // font,
    },
};

export default customTheme;
