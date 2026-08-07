import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { getAllLineaSlugs, getLineas, getLineaBySlug } from "@/lib/data";
import { urlForImage } from "@/sanity/image";

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
  const otras = lineas.filter((x) => x.slug !== l.slug);

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
              <p>{l.descripcion}</p>
              <div className={styles.badges}>
                <span>✓ Fabricación propia</span>
                <span>✓ Certificado NSF</span>
                <span>✓ Biodegradable</span>
              </div>
              <div className={styles.actions}>
                <Link href="/contacto" className={styles.btnPrimary}>Solicitar ficha técnica</Link>
              </div>
            </div>
            <div className={styles.heroImg}>
              <Image src={l.image} alt={l.nombre} width={520} height={620} priority />
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.infoSection}`}>
        <div className="container">
          <div className={styles.infoGrid}>
            <article>
              <div className={styles.emoji}>🧪</div>
              <h3>Fórmulas especializadas</h3>
              <p>Cada producto está desarrollado para la aplicación específica de la línea {l.nombre.toLowerCase()}.</p>
            </article>
            <article>
              <div className={styles.emoji}>📋</div>
              <h3>Documentación completa</h3>
              <p>Hoja de seguridad, ficha técnica, ayudas visuales y manual de manejo para cada producto.</p>
            </article>
            <article>
              <div className={styles.emoji}>🎓</div>
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
              <h2>{productos.length} productos línea {l.nombre}</h2>
              <p>Click en cualquier producto para ver la ficha completa.</p>
            </div>
            <ul className={styles.productGrid}>
              {productos.map((p) => {
                const src = p.imagenPrincipal ? urlForImage(p.imagenPrincipal).width(400).auto("format").url() : null;
                return (
                  <li key={p._id}>
                    <Link href={`/producto/${p.slug}`} className={styles.productCard}>
                      <div className={styles.productImg}>
                        {src ? <Image src={src} alt={p.nombre} width={300} height={300} /> : <div className={styles.imgPh}>Sin imagen</div>}
                      </div>
                      <div className={styles.productBody}>
                        <h3>{p.nombre}</h3>
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

      <section className={`section ${styles.otrasSection}`}>
        <div className="container container-wide">
          <div className={styles.sectionHead}>
            <h2>Otras líneas de químicos</h2>
          </div>
          <ul className={styles.otrasGrid}>
            {otras.map((o) => (
              <li key={o.slug}>
                <Link href={`/productos/quimicos/${o.slug}`} className={styles.otraCard}>
                  <Image src={o.image} alt={o.nombre} width={200} height={230} />
                  <strong>{o.nombre}</strong>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
