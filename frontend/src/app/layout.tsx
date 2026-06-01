import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, Lora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: 'swap',
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Sanctum | Divine Ramayana Intelligence",
  description: "A sacred immersive space for contemplation on the Ramayana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${lora.variable} antialiased bg-[#050505] text-[#D4AF37]`}
      >
        {children}
      </body>
    </html>
  );
}
