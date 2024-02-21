import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sabiyya Collections Admin",
  description: "Sabiyya Collections",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
