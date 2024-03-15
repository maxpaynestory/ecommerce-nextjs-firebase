import type { Metadata } from "next";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "./ui/navBar";
import StoreProvider from "../storeProvider";
import IsClientAdmin from "./ui/isClientAdmin";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import "./ui/globals.css";

export const metadata: Metadata = {
  title: "Sabiyya Collections Admin",
  description: "Sabiyya Collections Admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <Box>
                <IsClientAdmin />
                <CssBaseline />
                <AppBar />
                {children}
              </Box>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
