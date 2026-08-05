import type { NextConfig } from "next";

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
};

export default nextConfig;
