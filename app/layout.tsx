import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { GsapPageEffects } from "@/components/GsapPageEffects";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, localBusinessJsonLd } from "@/lib/site";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FRTP - Terrassement, VRD et travaux publics à Fréjus",
    template: "%s | FRTP"
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/icon.png", type: "image/png" }]
  },
  keywords: [
    "terrassement Fréjus",
    "travaux publics Var",
    "VRD",
    "assainissement",
    "voirie",
    "réseaux",
    "aménagements extérieurs",
    "Alpes-Maritimes"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "FRTP - Terrassement, VRD et travaux publics à Fréjus",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/chantier/horizon-hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Chantier FRTP - travaux publics dans le Var"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FRTP - Terrassement, VRD et travaux publics à Fréjus",
    description: SITE_DESCRIPTION,
    images: ["/chantier/horizon-hero.jpeg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
        <SiteHeader />
        <main className="pt-20">
          <GsapPageEffects>{children}</GsapPageEffects>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
