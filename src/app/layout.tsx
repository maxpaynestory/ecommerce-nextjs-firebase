import type { Metadata } from "next";
import BootstrapJs from "./components/common/BootstrapJs";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import StoreProvider from "./storeProvider";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Sabiyya Collections",
  description: "Sabiyya Collections",
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
          {children}
          <BootstrapJs />
        </StoreProvider>
      </body>
    </html>
  );
}
