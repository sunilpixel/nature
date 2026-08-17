import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

/**
 * Only the weights the page actually sets: every `display` heading is 300, and
 * body copy is either 400 (default, labels) or 300 (`font-light`). Each unused
 * weight is another self-hosted woff2 in the critical path for nothing.
 */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WILD — Nature Beyond Time",
  description:
    "An immersive scrolling study of mountains, forests, water and light. Nature, at its own pace.",
  openGraph: {
    title: "WILD — Nature Beyond Time",
    description:
      "An immersive scrolling study of mountains, forests, water and light.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0a",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-bone text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
