import raw from "./blog-posts.json";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
  headings: string[];
  paragraphs: string[];
  images: { src: string; alt: string }[];
  originalUrl: string;
};

export type BlogPostRaw = {
  url: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  headings: string[];
  paragraphs: string[];
  images: { src: string; alt: string }[];
};

const slugMap: Record<string, string> = {
  "diferentes-tipos-de-desengrasantes": "diferentes-tipos-de-desengrasantes",
  "los-diferentes-tipos-de-desengrasantes-clasificación-y-cómo-elegir-el-mejor": "tipos-desengrasantes-clasificacion",
  "cómo-limpiar-canastilla-freidora": "como-limpiar-canastilla-freidora",
  "cómo-limpiar-plancha-decocina-0": "como-quitar-sarro-alberca",
  "aromatizante-para-baño": "aromatizante-para-bano",
  "cómo-limpiar-un-mingitorio-seco-1": "como-limpiar-mingitorio-seco",
  "qué-papel-higiénico-elijo-para-mi-negocio": "papel-higienico-para-negocio",
  "como-limpiar-y-cuidar-tu-piso-epóxico-para-prolongar-su-durabilidad": "cuidar-piso-epoxico",
  "trapeadores": "hablemos-sobre-trapeadores",
  "como-limpiar-un-piso-ceramico": "como-limpiar-piso-ceramico",
};

const posts: BlogPost[] = (raw as BlogPostRaw[]).map((p) => ({
  slug: slugMap[p.slug] ?? p.slug,
  title: p.title,
  description: p.description,
  image: p.image || undefined,
  date: p.date || undefined,
  headings: p.headings,
  paragraphs: p.paragraphs,
  images: p.images.filter((i) => i.src && !i.src.match(/logo|icon|siba/i)),
  originalUrl: p.url,
}));

export const allPosts = posts;
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
