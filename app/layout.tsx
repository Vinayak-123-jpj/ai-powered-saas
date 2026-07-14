import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediaPilot AI - Premium AI Media Management Platform",
  description: "Organize, compress, share, and optimize your images and videos using AI-generated metadata and robust streaming pipelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="dark">
        <body className={inter.className}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
