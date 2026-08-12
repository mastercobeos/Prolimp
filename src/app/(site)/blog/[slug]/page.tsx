import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import styles from "./page.module.css";
import { getAllPostSlugs, getPostBySlug, getPosts } from "@/lib/data";
import { urlForImage } from "@/sanity/image";

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.metaTitle ?? post.titulo,
    description: post.metaDescription ?? post.excerpt,
  };
}

const COLUMNA = 760; // ancho útil del cuerpo del artículo

type BloqueImagen = { _type: "image"; asset?: unknown; alt?: string; ancho?: number; alto?: number };

/* Respeta el tamaño del archivo original: nunca le pide a Sanity más ancho del
   que la imagen tiene, así que los sellos chicos se ven chicos y nítidos en vez
   de estirados a lo ancho de la columna. */
function ImagenContenido({
  value,
  enGaleria,
  esPortada,
}: { value: BloqueImagen; enGaleria?: boolean; esPortada?: boolean }) {
  if (!value?.asset) return null;
  const anchoReal = value.ancho ?? COLUMNA;
  const altoReal = value.alto ?? Math.round(anchoReal * 0.66);
  const ancho = Math.min(anchoReal, COLUMNA);
  const alto = Math.round((altoReal / anchoReal) * ancho);
  const clase = esPortada ? styles.portadaImg : enGaleria ? styles.galeriaImg : styles.contentImg;

  return (
    <Image
      src={urlForImage(value).width(Math.min(anchoReal, COLUMNA * 2)).auto("format").url()}
      alt={value.alt ?? ""}
      width={ancho}
      height={alto}
      priority={esPortada}
      className={clase}
      style={{ maxWidth: `${ancho}px` }}
    />
  );
}

/* Agrupa imágenes consecutivas en una fila. Varios artículos traen tandas de
   sellos o pasos seguidos que, uno bajo otro, quedaban en una columna larguísima. */
type Bloque = { _type?: string; [k: string]: unknown };
function agruparImagenes(bloques: Bloque[]): Bloque[] {
  const salida: Bloque[] = [];
  let buffer: Bloque[] = [];
  const volcar = () => {
    if (buffer.length > 1) {
      salida.push({ _type: "galeria", _key: `galeria-${salida.length}`, imagenes: buffer });
    } else if (buffer.length === 1) {
      salida.push(buffer[0]);
    }
    buffer = [];
  };
  for (const b of bloques) {
    if (b?._type === "image") buffer.push(b);
    else { volcar(); salida.push(b); }
  }
  volcar();
  return salida;
}

const portableComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h1: ({ children }) => <h2>{children}</h2>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    code: ({ children }) => <code>{children}</code>,
    link: ({ value, children }) => (
      <a href={value?.href} target={value?.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => <ImagenContenido value={value as BloqueImagen} />,
    galeria: ({ value }) => (
      <div className={styles.galeria}>
        {(value as { imagenes: BloqueImagen[] }).imagenes.map((img, i) => (
          <ImagenContenido key={i} value={img} enGaleria />
        ))}
      </div>
    ),
  },
};

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getPosts(),
  ]);
  if (!post) notFound();

  const others = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const wordCount = JSON.stringify(post.contenido ?? []).split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 220));

  const portada = post.imagenPortada as (BloqueImagen | undefined);
  const heroImgSrc = portada ? urlForImage(portada).width(Math.min(portada.ancho ?? 1200, 1200)).url() : undefined;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.titulo,
    description: post.excerpt,
    image: heroImgSrc,
    datePublished: post.fechaPublicacion,
    dateModified: post.fechaPublicacion,
    author: { "@type": "Organization", name: post.autor || "Equipo Prolimp" },
    publisher: {
      "@type": "Organization",
      name: "Prolimp",
      logo: { "@type": "ImageObject", url: "https://www.prolimp.com/img/logo/logo.webp" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.prolimp.com/blog/${post.slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <article className={styles.article}>
        <header className={styles.header}>
          <div className="container">
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/">Inicio</Link>
              <span>/</span>
              <Link href="/blog">Blog</Link>
            </nav>
            <span className={styles.eyebrow}>Artículo</span>
            <h1>{post.titulo}</h1>
            {post.excerpt && <p className={styles.lede}>{post.excerpt}</p>}
            <div className={styles.meta}>
              <span>📖 {readingTime} min de lectura</span>
              {post.fechaPublicacion && (
                <span>
                  🗓️{" "}
                  {new Date(post.fechaPublicacion).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {post.autor && <span>✍️ {post.autor}</span>}
            </div>
          </div>
        </header>

        {portada?.asset ? (
          <div className={`container ${styles.portadaWrap}`}>
            <ImagenContenido value={{ ...portada, alt: portada.alt ?? post.titulo }} esPortada />
          </div>
        ) : null}

        <div className={`container ${styles.body}`}>
          {post.contenido ? (
            <PortableText
              value={agruparImagenes(post.contenido as Bloque[]) as never}
              components={portableComponents}
            />
          ) : (
            <p>Este artículo se está actualizando.</p>
          )}

          <aside className={styles.cta}>
            <h3>¿Necesitas los productos que mencionamos?</h3>
            <p>Solicita cotización o explora el catálogo completo.</p>
            <div className={styles.ctaActions}>
              <Link href="/contacto" className={styles.btnPrimary}>Solicitar cotización</Link>
              <Link href="/productos" className={styles.btnGhost}>Ver catálogo</Link>
            </div>
          </aside>
        </div>
      </article>

      <section className={`section ${styles.others}`}>
        <div className="container container-wide">
          <h2>Otros artículos que te pueden interesar</h2>
          <ul>
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/blog/${o.slug}`}>
                  <h3>{o.title}</h3>
                  <p>{o.description}</p>
                  <span>Leer más →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
