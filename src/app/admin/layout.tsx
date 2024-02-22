import type { Metadata } from "next";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { ToastContainer } from "react-toastify";
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
        <ThemeProvider theme={theme}>
          {children}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
