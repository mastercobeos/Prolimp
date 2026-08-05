import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import styles from "./page.module.css";
import { getAllPostSlugs, getEmpresa, getPostBySlug, getPosts } from "@/lib/data";
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

const portableComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  types: {
    image: ({ value }) =>
      value?.asset ? (
        <Image
          src={urlForImage(value).width(1200).url()}
          alt={value.alt ?? ""}
          width={1200}
          height={800}
          className={styles.contentImg}
        />
      ) : null,
  },
};

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [post, allPosts, empresa] = await Promise.all([
    getPostBySlug(slug),
    getPosts(),
    getEmpresa(),
  ]);
  if (!post) notFound();

  const others = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const wordCount = JSON.stringify(post.contenido ?? []).split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 220));

  const heroImgSrc = post.imagenPortada ? urlForImage(post.imagenPortada).width(1200).url() : undefined;
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
      logo: { "@type": "ImageObject", url: "https://www.prolimp.com/img/logo/prolimp-logo.webp" },
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

        <div className={`container ${styles.body}`}>
          {post.contenido ? (
            <PortableText value={post.contenido as never} components={portableComponents} />
          ) : (
            <p>Este artículo se está actualizando.</p>
          )}

          <aside className={styles.cta}>
            <h3>¿Necesitas los productos que mencionamos?</h3>
            <p>Cotización rápida por WhatsApp o formulario.</p>
            <div className={styles.ctaActions}>
              <a
                href={`https://wa.me/${empresa.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                Escribir por WhatsApp
              </a>
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
