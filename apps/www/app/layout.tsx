import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { marketingConfig } from "@/config/marketing";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: marketingConfig.name,
    template: `%s | ${marketingConfig.name}`,
  },
  description: marketingConfig.description,
  keywords: ["workflow", "automation", "distributed", "engine", "weezy"],
  authors: [{ name: "Ankit Kumar" }],
  creator: "Ankit Kumar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://weezy.run",
    title: marketingConfig.name,
    description: marketingConfig.description,
    siteName: marketingConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: marketingConfig.name,
    description: marketingConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
