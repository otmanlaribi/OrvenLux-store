import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// Both are variable fonts: the full weight axis is self-hosted, covering
// Fraunces 300-500 (display) and Inter 400-600 (text) as used by the design system.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://orven-lux.example"),
  title: { default: "ORVEN LUX", template: "%s | ORVEN LUX" },
  description: "ORVEN LUX online store",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.ico", apple: "/favicon.ico" },
  openGraph: { type: "website", siteName: "ORVEN LUX", title: "ORVEN LUX", description: "ORVEN LUX online store", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ORVEN LUX" }] },
  twitter: { card: "summary_large_image", title: "ORVEN LUX", description: "ORVEN LUX online store", images: ["/opengraph-image"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased font-sans`}
    >
      <body className="bg-background text-foreground">
  {children}
  <Toaster richColors position="top-right" />
</body>
    </html>
  );
}
