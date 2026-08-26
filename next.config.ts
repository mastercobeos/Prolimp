import type { NextConfig } from "next";
import { legacyRedirects } from "./legacy-redirects";

const nextConfig: NextConfig = {
  images: {
    // Desactivamos optimizer de Vercel: nuestras imágenes ya vienen optimizadas
    // (Sanity CDN entrega WebP con ?w=X&auto=format, Unsplash igual, locales ya son WebP).
    // Evita quema de quota en plan Hobby (HTTP 402) y ahorra bandwidth.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["clsx"],
  },
  async redirects() {
    return [
      // PLEC no es una línea más: es marca propia y tiene su landing dedicada.
      // Su página de línea quedaría vacía (sus productos viven en Aseo General,
      // Baños, etc.), así que se manda a la landing que sí tiene contenido.
      { source: "/productos/quimicos/plec", destination: "/plec", permanent: false },
      // URLs del WordPress viejo (/product, /product-category, /descargas).
      ...legacyRedirects,
    ];
  },
};

export default nextConfig;
