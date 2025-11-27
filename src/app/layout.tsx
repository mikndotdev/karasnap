import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { env } from "@/lib/env"
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
  title: "KaraSnap（カラスナップ）",
  description: "写真一枚撮って簡単に記録できるカラオケ履歴アプリ！",
    openGraph: {
      images: [
          {
              url: `${env.NEXT_PUBLIC_BASE_URL}/img/og.png`
          }
      ]
    }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <Toaster position="bottom-center" richColors />
        {children}
      </body>
    </html>
  );
}
