import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@/styles/cursor.css";
import { LenisProvider } from "@/components/ui/LenisProvider";
import { CursorProvider } from "@/components/cursor/CursorProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { CursorSpotlight } from "@/components/cursor/CursorSpotlight";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ServiceWorkerRegistration } from "@/components/ui/ServiceWorkerRegistration";
import { MusicPlayer } from "@/components/ui/MusicPlayer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const headingFont = inter;

const SITE_URL = "https://aryanbhalsing.dev";

export const metadata: Metadata = {
  title: {
    default: "Aryan Bhalsing | Full-Stack Developer & AI Enthusiast",
    template: "%s | Aryan Bhalsing",
  },
  description:
    "Full-Stack Developer & AI Enthusiast building secure, scalable web applications and intelligent systems. CS student at MIT Academy of Engineering, Pune.",
  keywords: [
    "full-stack developer",
    "AI enthusiast",
    "cybersecurity",
    "Python",
    "React",
    "Next.js",
    "portfolio",
  ],
  authors: [{ name: "Aryan Bhalsing" }],
  creator: "Aryan Bhalsing",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Aryan Bhalsing Portfolio",
    title: "Aryan Bhalsing | Full-Stack Developer & AI Enthusiast",
    description:
      "Full-Stack Developer & AI Enthusiast building secure, scalable web applications and intelligent systems.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Aryan Bhalsing — Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aryan Bhalsing | Full-Stack Developer & AI Enthusiast",
    description:
      "Full-Stack Developer & AI Enthusiast building secure, scalable web applications and intelligent systems.",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aryan Bhalsing",
  jobTitle: "Full-Stack Developer & AI Enthusiast",
  url: SITE_URL,
  sameAs: [
    "https://github.com/iamaryanbhalsing",
    "https://linkedin.com/in/iamaryanbhalsing",
    "https://leetcode.com/iamaryanbhalsing",
  ],
  knowsAbout: [
    "Full-Stack Development",
    "Artificial Intelligence",
    "Cybersecurity",
    "Python",
    "JavaScript",
    "React",
    "Next.js",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "MIT Academy of Engineering, Pune",
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
      className={`${inter.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ServiceWorkerRegistration />
        <ThemeProvider>
          <LenisProvider>
            <CursorProvider>
              <CustomCursor />
              <CursorSpotlight />
              <MusicPlayer />
              {children}
            </CursorProvider>
          </LenisProvider>
        </ThemeProvider>
        <Script
          id="jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
