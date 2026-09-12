import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "https://orven-lux.example"
  ),

  title: {
    default: "ORVEN LUX",
    template: "%s | ORVEN LUX",
  },

  description: "ORVEN LUX online store",

  manifest: "/manifest.webmanifest",

  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    siteName: "ORVEN LUX",
    title: "ORVEN LUX",
    description: "ORVEN LUX online store",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ORVEN LUX",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ORVEN LUX",
    description: "ORVEN LUX online store",
    images: ["/opengraph-image"],
  },
};

const fontVariables = {
  "--font-inter":
    'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',

  "--font-fraunces":
    'Fraunces, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
} as React.CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
      style={fontVariables}
    >
      <body className="bg-background text-foreground">
        <TooltipProvider>
          {children}

          <Toaster
            position="top-center"
            richColors
            closeButton
            duration={5000}
            expand
            toastOptions={{
              className: "z-[99999]",
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}