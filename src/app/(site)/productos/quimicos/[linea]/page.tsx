import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { getAllLineaSlugs, getLineas, getLineaBySlug } from "@/lib/data";
import { urlForImage } from "@/sanity/image";
import { CtaBand } from "@/components/shared/CtaBand";
import { Lineas } from "@/components/home/Lineas";
import { splitNombreProducto } from "@/lib/productName";

/* Complemento del lede por línea (lámina 5) — el resto viene de Sanity */
const LEDE_EXTRA: Record<string, string> = {
  automotriz: "Además de productos para el cuidado de manos de los operarios.",
};

type Params = { linea: string };

export async function generateStaticParams() {
  const slugs = await getAllLineaSlugs();
  return slugs.map(({ slug }) => ({ linea: slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { linea } = await params;
  const lineas = await getLineas();
  const l = lineas.find((x) => x.slug === linea);
  if (!l) return {};
  return {
    title: `Línea ${l.nombre} — Químicos Prolimp®`,
    description: l.descripcion,
  };
}

export default async function LineaPage({ params }: { params: Promise<Params> }) {
  const { linea } = await params;
  const [lineas, lineaData] = await Promise.all([
    getLineas(),
    getLineaBySlug(linea),
  ]);
  const l = lineas.find((x) => x.slug === linea);
  if (!l) notFound();

  const productos = lineaData?.productos ?? [];

  return (
    <>
      <section className={styles.hero}>
        <div className="container container-wide">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Inicio</Link>
            <span>/</span>
            <Link href="/productos">Productos</Link>
            <span>/</span>
            <Link href="/productos/quimicos">Químicos</Link>
            <span>/</span>
            <span aria-current="page">{l.nombre}</span>
          </nav>
          <div className={styles.heroInner}>
            <div>
              <span className={styles.eyebrow}>Línea de químicos propios</span>
              <h1>Línea {l.nombre}</h1>
              <p>
                {l.descripcion}
                {LEDE_EXTRA[l.slug] && <> {LEDE_EXTRA[l.slug]}</>}
              </p>
              <div className={styles.stats}>
                <div>
                  <strong>11</strong>
                  <span>Líneas de limpiadores propios</span>
                </div>
                <div>
                  <strong>+35</strong>
                  <span>años de experiencia</span>
                </div>
                <div>
                  <strong>ISO</strong>
                  <span>9001 certificados</span>
                </div>
              </div>
            </div>
            <div className={styles.heroImg}>
              <Image src={l.image} alt={l.nombre} width={400} height={500} priority />
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.infoSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrowSm}>Nuestra fórmula</span>
            <h2>Qué hace diferentes a nuestros limpiadores</h2>
          </div>
          <div className={styles.infoGrid}>
            <article>
              <div className={styles.infoIcon} aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l4.5 2.6v5.2L12 12.4 7.5 9.8V4.6z" />
                  <path d="M7.5 14.2 12 16.8l4.5-2.6M12 16.8V22" />
                  <circle cx="12" cy="7.2" r="1.2" />
                </svg>
              </div>
              <h3>Fórmulas especializadas</h3>
              <p>Cada producto está desarrollado para la aplicación específica de la línea {l.nombre.toLowerCase()}.</p>
            </article>
            <article>
              <div className={styles.infoIcon} aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 4h6v3H9zM9 4H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3>Documentación completa</h3>
              <p>Hoja de seguridad, ficha técnica, ayudas visuales y manual de manejo para cada producto.</p>
            </article>
            <article>
              <div className={styles.infoIcon} aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="8" r="3.5" />
                  <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
                  <path d="M15.5 10.5l1.6 1.6 3.2-3.2" />
                </svg>
              </div>
              <h3>Capacitación STPS</h3>
              <p>Ofrecemos curso de manejo seguro registrado ante la STPS a nuestros clientes.</p>
            </article>
          </div>
        </div>
      </section>

      {productos.length > 0 ? (
        <section className={`section ${styles.productsSection}`}>
          <div className="container container-wide">
            <div className={styles.sectionHead}>
              <span className={styles.eyebrowSm}>Línea de limpiadores propios</span>
              <h2>Productos línea {l.nombre}</h2>
            </div>
            <ul className={styles.productGrid}>
              {productos.map((p) => {
                const src = p.imagenPrincipal ? urlForImage(p.imagenPrincipal).width(400).auto("format").url() : null;
                const { titulo, subtitulo } = splitNombreProducto(p.nombre);
                return (
                  <li key={p._id}>
                    <Link href={`/producto/${p.slug}`} className={styles.productCard}>
                      <div className={styles.productImg}>
                        {src ? <Image src={src} alt={p.nombre} width={300} height={300} /> : <div className={styles.imgPh}>Sin imagen</div>}
                      </div>
                      <div className={styles.productBody}>
                        <h3>{titulo}</h3>
                        {subtitulo && <span className={styles.productSubtitulo}>{subtitulo}</span>}
                        {p.descripcionCorta && <p>{p.descripcionCorta}</p>}
                        {p.sku && <span className={styles.productSku}>SKU · {p.sku}</span>}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : (
        <section className={`section ${styles.emptyState}`}>
          <div className="container">
            <div className={styles.emptyBox}>
              <div className={styles.emptyIcon}>📦</div>
              <h2>Aún no hay productos cargados en línea {l.nombre}</h2>
              <p>Nuestro equipo puede enviarte la ficha técnica.</p>
              <div className={styles.emptyActions}>
                <Link href="/contacto" className={styles.btnPrimary}>Pedir información</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <CtaBand
        variant="azul"
        titulo="¿Quieres ver nuestro catálogo en PDF?"
        lede="Estamos seguros de la eficacia de nuestros productos."
        cta="Descarga Catálogo"
        href="/descarga-catalogo"
      />

      <Lineas lineas={lineas} />
    </>
  );
}
