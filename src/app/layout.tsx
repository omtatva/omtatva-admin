import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Om Tatva Admin",
  description: "Manage Om Tatva Digitals website content",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
