import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { urlForImage } from "@/sanity/image";
import { getProductoBySlug } from "@/lib/data";
import styles from "./page.module.css";

type Params = Promise<{ slug: string }>;

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductoBySlug(slug);
  if (!p) return { title: "Producto no encontrado" };
  return {
    title: p.metaTitle || p.nombre,
    description: p.metaDescription || p.descripcionCorta || `${p.nombre} — Prolimp`,
  };
}

export default async function ProductoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getProductoBySlug(slug);
  if (!p) return notFound();

  const heroSrc = p.imagenPrincipal ? urlForImage(p.imagenPrincipal).width(1200).auto("format").url() : undefined;
  const gallery = (p.galeria ?? []).map((g) => urlForImage(g).width(800).auto("format").url());

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    sku: p.sku,
    description: p.descripcionCorta || p.metaDescription || `${p.nombre} — Prolimp`,
    image: heroSrc,
    brand: p.marca ? { "@type": "Brand", name: p.marca.nombre } : undefined,
    category: p.categoria?.nombre,
    offers: p.linkExterno ? {
      "@type": "Offer",
      url: p.linkExterno,
      availability: "https://schema.org/InStock",
      priceCurrency: "MXN",
      seller: { "@type": "Organization", name: "Prolimp" },
    } : undefined,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.prolimp.com" },
      { "@type": "ListItem", position: 2, name: "Productos", item: "https://www.prolimp.com/productos" },
      ...(p.categoria ? [{
        "@type": "ListItem", position: 3, name: p.categoria.nombre,
        item: `https://www.prolimp.com/productos/${p.categoria.slug}`,
      }] : []),
      { "@type": "ListItem", position: p.categoria ? 4 : 3, name: p.nombre,
        item: `https://www.prolimp.com/producto/${p.slug}` },
    ],
  };

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <nav className={styles.crumb} aria-label="Migas">
        <Link href="/">Inicio</Link>
        <span>›</span>
        <Link href="/productos">Productos</Link>
        {p.categoria && (
          <>
            <span>›</span>
            <Link href={`/productos/${p.categoria.slug}`}>{p.categoria.nombre}</Link>
          </>
        )}
        <span>›</span>
        <span className={styles.crumbCurrent}>{p.nombre}</span>
      </nav>

      <div className={styles.grid}>
        <section className={styles.mediaCol}>
          {heroSrc ? (
            <div className={styles.heroImageWrap}>
              <Image src={heroSrc} alt={p.nombre} width={1200} height={1200} priority className={styles.heroImage} />
            </div>
          ) : (
            <div className={styles.heroPlaceholder}>Sin imagen</div>
          )}
          {gallery.length > 0 && (
            <ul className={styles.thumbs}>
              {gallery.map((src, i) => (
                <li key={i}>
                  <Image src={src} alt={`${p.nombre} — imagen ${i + 2}`} width={160} height={160} className={styles.thumb} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.infoCol}>
          <div className={styles.eyebrowRow}>
            {p.marca && <span className={styles.marca}>{p.marca.nombre}</span>}
            {p.linea && (
              <Link href={`/productos/quimicos/${p.linea.slug}`} className={styles.lineaChip}>
                {p.linea.nombre}
              </Link>
            )}
          </div>

          <h1 className={styles.title}>{p.nombre}</h1>
          {p.sku && <p className={styles.sku}>SKU · {p.sku}</p>}

          {p.descripcionCorta && <p className={styles.lead}>{p.descripcionCorta}</p>}

          <div className={styles.ctas}>
            <Link href="/contacto" className={styles.quoteBtn}>Solicitar cotización</Link>
          </div>

          {p.presentaciones && p.presentaciones.length > 0 && (
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Presentaciones disponibles</h2>
              <ul className={styles.pillList}>
                {p.presentaciones.map((pr, i) => (
                  <li key={i} className={styles.pill}>
                    {pr.medida}
                    {pr.codigo && <span className={styles.pillCode}>{pr.codigo}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {p.aplicaciones && p.aplicaciones.length > 0 && (
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Aplicaciones y usos</h2>
              <ul className={styles.pillList}>
                {p.aplicaciones.map((a, i) => (
                  <li key={i} className={styles.pillLight}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {p.beneficios && p.beneficios.length > 0 && (
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Beneficios clave</h2>
              <ul className={styles.benefits}>
                {p.beneficios.map((b, i) => (
                  <li key={i}><span className={styles.check} aria-hidden>✓</span>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {p.descripcion && (p.descripcion as unknown[]).length > 0 && (
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Descripción</h2>
              <div className={styles.prose}>
                <PortableText value={p.descripcion as never} />
              </div>
            </div>
          )}

          {(p.fichaTecnica || p.hojaSeguridad) && (
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Documentos</h2>
              <div className={styles.docs}>
                {p.fichaTecnica && (
                  <a href={p.fichaTecnica.url} target="_blank" rel="noopener noreferrer" className={styles.docBtn}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
                      <path d="M14 2v6h6"/>
                    </svg>
                    Ficha técnica (PDF)
                  </a>
                )}
                {p.hojaSeguridad && (
                  <a href={p.hojaSeguridad.url} target="_blank" rel="noopener noreferrer" className={styles.docBtn}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
                    </svg>
                    Hoja de seguridad (PDF)
                  </a>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
