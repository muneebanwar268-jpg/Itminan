import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CartDrawer } from "@/components/ecommerce/CartDrawer";
import { Navbar } from "@/components/navigation/Navbar";
import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ITMINAAN | Handcrafted Pakistani Handbags",
  description:
    "Discover ITMINAAN — beautifully handcrafted Pakistani handbags featuring traditional block printing, mirror work and tassel detailing. COD available across Pakistan.",
  openGraph: {
    title: "ITMINAAN | Handcrafted Pakistani Handbags",
    description:
      "Traditional block printing, mirror work & tassel detailing. Delivered across Pakistan. Rs. 1,299.",
    type: "website",
  },
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
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body suppressHydrationWarning className={styles.body}>
        <MetaPixel />
        <SmoothScrollProvider>
          <AnnouncementBar />
          <Navbar />
          {children}
          <CartDrawer />
          <WhatsAppFloat />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
