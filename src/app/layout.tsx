import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { AudioProvider } from "@/components/audio/audio-engine";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { RevealReady } from "@/components/motion/reveal-ready";
import { site, contact } from "@/data/site";

// Variable typefaces — weights are animated live via the `wght` axis.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://irontechdetailing.com"),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description:
    "Irontech Detailing Services Pvt Ltd delivers accurate, on-schedule structural and miscellaneous steel detailing — shop and erection drawings, SDS/2 modelling, connection design and CNC/DXF deliverables to AISC, NISD and OSHA standards.",
  keywords: [
    "structural steel detailing",
    "shop drawings",
    "erection drawings",
    "SDS/2 detailing",
    "miscellaneous steel detailing",
    "AISC NISD OSHA",
    "steel connection design",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description:
      "Accurate, on-schedule structural steel detailing built for the fabrication shop and the erector.",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/assets/logos/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#0d1016",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.legalName,
    alternateName: site.name,
    description: site.tagline,
    email: contact.email,
    telephone: contact.phone,
    url: "https://irontechdetailing.com",
    areaServed: "Worldwide",
    knowsAbout: [
      "Structural steel detailing",
      "Miscellaneous steel detailing",
      "SDS/2 modelling",
      "Shop and erection drawings",
    ],
  };

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <RevealReady />
        <AudioProvider>
          <SmoothScroll>
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </SmoothScroll>
        </AudioProvider>
      </body>
    </html>
  );
}
