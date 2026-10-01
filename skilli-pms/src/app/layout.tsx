import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skilli — IMCC Academic Project Management & Mentorship",
  description: "The unified Skilli platform for IMCC College capstone management, deliverables, rubrics, and mentorship.",
  keywords: [
    "academic project management",
    "IMCC College",
    "Skilli capstone portal",
    "student projects",
    "mentorship platform",
    "rubrics evaluation",
    "kanban taskboard",
  ],
  icons: {
    icon: "/Skilli-Logo-Vector.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`} suppressHydrationWarning>
      <body className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased">
        {children}
      </body>
    </html>
  );
}
