import {
    Theme as MUITheme,
    ThemeOptions as MUIThemeOptions,
} from '@mui/material/styles';

import {
    Theme as MUITheme2,
    ThemeOptions as MUIThemeOptions2,
} from '@mui/system';
import type { ICustomSpacing } from '../modes/shared/custom-spacing';
import type { IThemeFont } from '../modes/shared/font';
import type { ICustomBreakpoints, IThemeCustoms } from '../modes/custom-theme';
import { IThemePalette } from '../modes/light-mode';

declare module '@mui/material/styles' {
    export interface Theme extends MUITheme {
        breakpoints: ICustomBreakpoints;
        palette: IThemePalette;
        customs: IThemeCustoms;
    }

    export interface ThemeOptions extends MUIThemeOptions {
        breakpoints?: ICustomBreakpoints;
        palette?: IThemePalette;
        customs?: IThemeCustoms;
    }

    export function createTheme(options?: ThemeOptions): Theme;
}

declare module '@mui/system' {
    export interface Theme extends MUITheme2 {
        breakpoints: ICustomBreakpoints;
        palette: IThemePalette;
        customs: IThemeCustoms;
    }

    export interface ThemeOptions extends MUIThemeOptions2 {
        breakpoints?: ICustomBreakpoints;
        palette?: IThemePalette;
        customs?: IThemeCustoms;
    }

    export function createTheme(options?: ThemeOptions): Theme;
}
