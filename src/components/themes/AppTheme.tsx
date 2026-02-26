"use client";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { useMemo } from "react";
import customTheme from "./CustomTheme";
import { CssBaseline } from "@mui/material";
import { NextAppDirEmotionCacheProvider } from "./EmotionCache";

const AppTheme: React.FC<React.PropsWithChildren> = ({ children }) => {
  const theme = useMemo(() => {
    const baseTheme = createTheme(customTheme);
    return baseTheme;
  }, []);
  return (
    // <NextAppDirEmotionCacheProvider options={{key: 'mui'}}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <>{children}</>
    </ThemeProvider>
    // </NextAppDirEmotionCacheProvider>
  );
};

export default AppTheme;
