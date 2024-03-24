import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  viewportFit: 'cover'
}

export const metadata: Metadata = {
  title: "TeeTimes",
  description: "Find out about Tee Times",
  generator: "Next.js",
  manifest: "/manifest.json",
  icons: {
    apple: [
      { rel: 'apple-touch-icon', url: '/icons/apple-touch-icon.png' },
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#5bbad5' }
    ],
    icon: [
      { rel: 'icon', url: '/icons/favicon-32x32.png', sizes: "32x32" },
      { rel: 'icon', url: '/icons/favicon-16x16.png', sizes: "16x16" },
    ]
  },
  keywords: ["nextjs", "nextjs13", "next13", "pwa", "next-pwa"],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
