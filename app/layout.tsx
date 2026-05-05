import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PUPP Pamokos",
  description: "Moderni PUPP samprotavimo rašinio mokymosi platforma lietuvių kalba.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="lt">
      <body>{children}</body>
    </html>
  );
}
