import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supabase + Vercel Playground",
  description: "A barebones equipment service tracker for learning the stack.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
