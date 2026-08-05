import type { MetadataRoute } from "next";
import {
  getAllCategoriaSlugs,
  getAllLineaSlugs,
  getAllPostSlugs,
  getAllProductoSlugs,
  getAllMarcaSlugs,
} from "@/lib/data";

const site = "https://www.prolimp.com";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cats, lineas, posts, productos, marcas] = await Promise.all([
    getAllCategoriaSlugs(),
    getAllLineaSlugs(),
    getAllPostSlugs(),
    getAllProductoSlugs(),
    getAllMarcaSlugs(),
  ]);

  const entries: Entry[] = [
    // Estáticas top-level
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/nosotros", priority: 0.8, changeFrequency: "monthly" },
    { path: "/productos", priority: 0.9, changeFrequency: "weekly" },
    { path: "/sucursales", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contacto", priority: 0.7, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    { path: "/descarga-catalogo", priority: 0.6, changeFrequency: "monthly" },
    { path: "/sistemas-dilucion", priority: 0.7, changeFrequency: "monthly" },
    // Landings sectoriales
    { path: "/industria-alimentaria", priority: 0.8, changeFrequency: "monthly" },
    { path: "/industria-lactea", priority: 0.8, changeFrequency: "monthly" },
    { path: "/hospitales", priority: 0.8, changeFrequency: "monthly" },
    { path: "/plec", priority: 0.7, changeFrequency: "monthly" },
    { path: "/siba", priority: 0.7, changeFrequency: "monthly" },
    // Legal
    { path: "/aviso-de-privacidad", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terminos-y-condiciones", priority: 0.3, changeFrequency: "yearly" },
  ];

  // Dinámicas
  cats.forEach((c) => entries.push({ path: `/productos/${c.slug}`, priority: 0.8, changeFrequency: "weekly" }));
  lineas.forEach((l) => entries.push({ path: `/productos/quimicos/${l.slug}`, priority: 0.7, changeFrequency: "weekly" }));
  marcas.forEach((m) => entries.push({ path: `/marca/${m.slug}`, priority: 0.6, changeFrequency: "monthly" }));
  productos.forEach((p) => entries.push({ path: `/producto/${p.slug}`, priority: 0.6, changeFrequency: "monthly" }));
  posts.forEach((p) => entries.push({ path: `/blog/${p.slug}`, priority: 0.5, changeFrequency: "monthly" }));

  const now = new Date();
  return entries.map((e) => ({
    url: `${site}${e.path}`,
    lastModified: now,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
