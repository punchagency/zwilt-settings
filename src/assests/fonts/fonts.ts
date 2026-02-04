import localFont from '@next/font/local';



export const switzer = localFont({
  src: [
    {
      path: "./Switzer-Black.woff2",
      weight: "900",
      style: "black",
    },
    {
      path: "./Switzer-Extrabold.woff2",
      weight: "800",
      style: "extrabold",
    },
    {
      path: "./Switzer-Bold.woff2",
      weight: "700",
      style: "bold",
    },
    {
      path: "./Switzer-Semibold.woff2",
      weight: "600",
      style: "semibold",
    },
    {
      path: "./Switzer-Medium.woff2",
      weight: "500",
      style: "medium",
    },
    {
      path: "./Switzer-Regular.woff2",
      weight: "400",
      style: "regular",
    },
    {
      path: "./Switzer-Light.woff2",
      weight: "300",
      style: "light",
    },
    {
      path: "./Switzer-Thin.woff2",
      weight: "100",
      style: "thin",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
});
