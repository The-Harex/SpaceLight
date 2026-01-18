import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import APODBackground from "@/components/APODBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpaceLight Dashboard",
  description: "Illuminate the night sky. Powered by SpaceLight.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-200 min-h-screen relative`}
      >
        <APODBackground />
        <main className="relative z-10 w-full min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
