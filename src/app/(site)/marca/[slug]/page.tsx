import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { urlForImage } from "@/sanity/image";
import { getMarcaBySlug, getMarcas } from "@/lib/data";
import styles from "./page.module.css";

type Params = Promise<{ slug: string }>;

export const revalidate = 60;

export async function generateStaticParams() {
  const marcas = await getMarcas();
  return marcas.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMarcaBySlug(slug);
  if (!m) return { title: "Marca no encontrada" };
  return {
    title: m.nombre,
    description: m.descripcion || `Productos de ${m.nombre} disponibles en Prolimp. ${m.productos?.length ?? 0} productos en catálogo.`,
  };
}

export default async function MarcaPage({ params }: { params: Params }) {
  const { slug } = await params;
  const marca = await getMarcaBySlug(slug);
  if (!marca) return notFound();

  const logoSrc = marca.logo ? urlForImage(marca.logo).width(400).auto("format").url() : null;
  const productos = marca.productos ?? [];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container container-wide">
          <nav className={styles.crumb} aria-label="Migas">
            <Link href="/">Inicio</Link>
            <span>›</span>
            <Link href="/productos">Productos</Link>
            <span>›</span>
            <span className={styles.crumbCurrent}>{marca.nombre}</span>
          </nav>

          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <span className={styles.eyebrow}>
                {marca.propia ? "Fabricación propia" : "Marca aliada"}
              </span>
              <h1>{marca.nombre}</h1>
              <p>
                {marca.descripcion ??
                  (marca.propia
                    ? `${marca.nombre} es una de las líneas de fabricación propia de Prolimp del Centro, con calidad garantizada por más de 50 años en el mercado mexicano.`
                    : `Distribuidor autorizado de ${marca.nombre}. Todo el catálogo con envíos a nivel nacional y garantía de origen.`)}
              </p>
              <div className={styles.stats}>
                <div>
                  <strong>{productos.length}</strong>
                  <span>productos</span>
                </div>
                {marca.propia && (
                  <div>
                    <strong>50+</strong>
                    <span>años en el mercado</span>
                  </div>
                )}
              </div>
              <div className={styles.actions}>
                <Link href="/contacto" className={styles.btnPrimary}>Solicitar cotización</Link>
              </div>
            </div>
            {logoSrc && (
              <div className={styles.logoWrap}>
                <Image src={logoSrc} alt={marca.nombre} width={280} height={280} className={styles.logo} priority />
              </div>
            )}
          </div>
        </div>
      </section>

      {productos.length > 0 ? (
        <section className={`section ${styles.productsSection}`}>
          <div className="container container-wide">
            <div className={styles.sectionHead}>
              <h2>Catálogo completo</h2>
              <p>{productos.length} productos disponibles. Click en cualquiera para ver ficha completa.</p>
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
                        {p.categoria && <span className={styles.productCat}>{p.categoria.nombre}</span>}
                        <h3>{p.nombre}</h3>
                        {p.descripcionCorta && <p>{p.descripcionCorta}</p>}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : (
        <section className={`section ${styles.empty}`}>
          <div className="container">
            <div className={styles.emptyBox}>
              <p>Aún no hay productos cargados para {marca.nombre}. Contáctanos para consultar disponibilidad.</p>
              <Link href="/contacto" className={styles.btnPrimary}>Contactar</Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
