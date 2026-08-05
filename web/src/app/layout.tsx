import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.prolimp.com"),
  title: {
    default: "Prolimp | Productos y químicos de limpieza profesional",
    template: "%s | Prolimp",
  },
  description:
    "Fabricantes mexicanos de químicos y productos de limpieza para industria, hoteles, hospitales, restaurantes y hogar. 11 líneas propias con certificación ISO 9001.",
  openGraph: {
    title: "Prolimp | Productos y químicos de limpieza profesional",
    description:
      "Fabricantes mexicanos de químicos y productos de limpieza para industria, hoteles, hospitales, restaurantes y hogar.",
    url: "https://www.prolimp.com",
    siteName: "Prolimp",
    locale: "es_MX",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Prolimp",
  legalName: "Prolimp del Centro, S.A. de C.V.",
  url: "https://www.prolimp.com",
  logo: "https://www.prolimp.com/img/logo/prolimp-logo.webp",
  description:
    "Fabricantes mexicanos de químicos y productos de limpieza para industria, hoteles, hospitales, restaurantes y hogar. 11 líneas propias con certificación ISO 9001.",
  foundingDate: "1971",
  sameAs: [
    "https://www.facebook.com/prolimpdelcentro",
    "https://www.instagram.com/prolimp1",
    "https://www.linkedin.com/company/prolimp-del-centro",
    "https://www.youtube.com/prolimp1",
  ],
  contactPoint: [{
    "@type": "ContactPoint",
    telephone: "+52-229-140-6981",
    contactType: "sales",
    email: "contacto@prolimp.com",
    areaServed: "MX",
    availableLanguage: ["es"],
  }],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Xalapa",
    addressRegion: "Veracruz",
    addressCountry: "MX",
  },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Prolimp",
  url: "https://www.prolimp.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.prolimp.com/productos?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        {children}
      </body>
    </html>
  );
}
