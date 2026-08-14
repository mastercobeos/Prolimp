import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { urlForImage } from "@/sanity/image";
import { getProductoBySlug } from "@/lib/data";
import { splitNombreProducto } from "@/lib/productName";
import { ProductGallery } from "./ProductGallery";
import styles from "./page.module.css";

/* Los documentos migrados traen al final del cuerpo los links crudos de la página
   vieja ("wa.link/...", "prolimp.com/sucursales..."); esa invitación ahora vive en
   la banda "¿Te gustaría probarlo?" al pie, así que se filtran del prose. */
type PTSpan = { text?: string };
type PTBlock = { _type?: string; children?: PTSpan[] };
function limpiarDescripcion(blocks: unknown[]): unknown[] {
  const basura = /wa\.link|wa\.me|prolimp\.com\/sucursales|¿te gustaría probarlo\?|conoce nuestras sucursales donde puedes adquirirlo/i;
  return blocks.filter((b) => {
    const block = b as PTBlock;
    if (block._type !== "block" || !block.children) return true;
    const texto = block.children.map((c) => c.text ?? "").join("").trim();
    if (!texto) return true;
    return !basura.test(texto);
  });
}

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
  const gallery = (p.galeria ?? []).map((g) => urlForImage(g).width(1200).auto("format").url());
  const slides = [heroSrc, ...gallery].filter((s): s is string => Boolean(s));
  const { titulo: nombreTitulo, subtitulo: nombreSubtitulo } = splitNombreProducto(p.nombre);
  const descripcionLimpia = limpiarDescripcion((p.descripcion as unknown[]) ?? []);

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
      <div className={styles.inner}>
        <nav className={styles.crumb} aria-label="Migas">
          <Link href="/">Inicio</Link>
          <span aria-hidden>›</span>
          <Link href="/productos">Productos</Link>
          {p.categoria && (
            <>
              <span aria-hidden>›</span>
              <Link href={`/productos/${p.categoria.slug}`}>{p.categoria.nombre}</Link>
            </>
          )}
          <span aria-hidden>›</span>
          <span className={styles.crumbCurrent}>{p.nombre}</span>
        </nav>

        <div className={styles.grid}>
          <section className={styles.mediaCol}>
            {slides.length > 0 ? (
              <ProductGallery slides={slides} alt={p.nombre} />
            ) : (
              <div className={styles.heroPlaceholder}>Sin imagen</div>
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

            <h1 className={styles.title}>{nombreTitulo}</h1>
            {nombreSubtitulo && <p className={styles.subtitle}>{nombreSubtitulo}</p>}
            {p.sku && <p className={styles.sku}>SKU · {p.sku}</p>}
            {p.descripcionCorta && <p className={styles.shortDesc}>{p.descripcionCorta}</p>}

            <div className={styles.ctas}>
              <Link href={`/contacto?producto=${p.slug}`} className={styles.quoteBtn}>Solicitar cotización</Link>
            </div>

            {descripcionLimpia.length > 0 && (
              <div className={styles.prose}>
                <PortableText value={descripcionLimpia as never} />
              </div>
            )}

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
      </div>

      <section className={styles.probarBand}>
        <div className={styles.probarInner}>
          <div className={styles.probarText}>
            <h2>¿Te gustaría probarlo?</h2>
            <p>Conoce nuestras sucursales donde puedes adquirirlo.</p>
          </div>
          <div className={styles.probarActions}>
            <Link href="/sucursales" className={styles.probarBtn}>Sucursales</Link>
            <Link href="/contacto" className={styles.probarBtn}>Contáctanos</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
