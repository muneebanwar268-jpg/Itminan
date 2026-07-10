import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CartDrawer } from "@/components/ecommerce/CartDrawer";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/sections/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Itminan | Premium Smart Tasbih Ring",
  description: "Experience spiritual clarity with Itminan, a premium luxury smart tasbih counter designed for modern mindfulness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${styles.root}`}
    >
      <body suppressHydrationWarning className={styles.body}>
        <SmoothScrollProvider>
          <Navbar />
          {children}
          <Footer />
          <CartDrawer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
