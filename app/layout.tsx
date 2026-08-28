import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SkillGraph",
  description: "Skill and career exploration platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}