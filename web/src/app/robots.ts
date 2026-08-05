import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
    ],
    sitemap: "https://www.prolimp.com/sitemap.xml",
    host: "https://www.prolimp.com",
  };
}
