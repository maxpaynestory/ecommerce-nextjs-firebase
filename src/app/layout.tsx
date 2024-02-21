import type { Metadata } from "next";
import BootstrapJs from "./components/common/BootstrapJs";

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
        {children}
        <BootstrapJs />
      </body>
    </html>
  );
}
