import type { Metadata } from "next";
import { Anton, Space_Grotesk } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Over the Breaks",
  description:
    "2 Nights at Lodge Room. September 18 + 19. Highland Park, Los Angeles.",
  openGraph: {
    title: "Over the Breaks",
    description:
      "2 Nights at Lodge Room. September 18 + 19. Highland Park, Los Angeles.",
    type: "website",
    locale: "en_US",
    siteName: "Over the Breaks",
  },
  twitter: {
    card: "summary_large_image",
    title: "Over the Breaks",
    description:
      "2 Nights at Lodge Room. September 18 + 19. Highland Park, Los Angeles.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${spaceGrotesk.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
