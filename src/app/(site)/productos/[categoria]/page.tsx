import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { getAllCategoriaSlugs, getCategorias, getCategoriaBySlug, getLineas } from "@/lib/data";
import { getSubcategorias } from "@/lib/subcategorias";
import { urlForImage } from "@/sanity/image";

type Params = { categoria: string };

export async function generateStaticParams() {
  const slugs = await getAllCategoriaSlugs();
  return slugs.map(({ slug }) => ({ categoria: slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { categoria } = await params;
  const cats = await getCategorias();
  const cat = cats.find((c) => c.slug === categoria);
  if (!cat) return {};
  return {
    title: cat.nombre,
    description: `${cat.descripcion} Cotización sin compromiso. Envíos a todo México.`,
  };
}

export default async function CategoriaPage({ params }: { params: Promise<Params> }) {
  const { categoria } = await params;
  const [categorias, lineas, catData] = await Promise.all([
    getCategorias(),
    getLineas(),
    getCategoriaBySlug(categoria),
  ]);
  const cat = categorias.find((c) => c.slug === categoria);
  if (!cat) notFound();

  const isQuimicos = cat.slug === "quimicos";
  const otras = categorias.filter((c) => c.slug !== cat.slug).slice(0, 4);
  const productos = catData?.productos ?? [];
  const subcats = getSubcategorias(cat.slug);

  return (
    <>
      <section className={styles.hero}>
        <div className="container container-wide">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Inicio</Link>
            <span>/</span>
            <Link href="/productos">Productos</Link>
            <span>/</span>
            <span aria-current="page">{cat.nombre}</span>
          </nav>
          <div className={styles.heroInner}>
            <div>
              <span className={styles.eyebrow}>Categoría</span>
              <h1>{cat.nombre}</h1>
              <p>{cat.descripcion}</p>
              <div className={styles.actions}>
                <Link href="/contacto" className={styles.btnPrimary}>Solicitar cotización</Link>
                <Link href="/productos" className={styles.btnGhost}>Ver todas las categorías</Link>
              </div>
            </div>
            <div className={styles.heroImg}>
              <Image src={cat.image} alt={cat.nombre} width={500} height={500} priority />
            </div>
          </div>
        </div>
      </section>

      {isQuimicos && (
        <section className={`section ${styles.lineasSection}`}>
          <div className="container container-wide">
            <div className={styles.sectionHead}>
              <span className={styles.eyebrowSm}>Fabricación propia</span>
              <h2>11 líneas de químicos Prolimp®</h2>
              <p>Cada línea reúne fórmulas específicas para un tipo de superficie o entorno.</p>
            </div>
            <ul className={styles.lineasGrid}>
              {lineas.map((l) => (
                <li key={l.slug}>
                  <Link href={`/productos/quimicos/${l.slug}`} className={styles.lineaCard}>
                    <div className={styles.lineaImg}>
                      <Image src={l.image} alt={l.nombre} width={400} height={460} />
                    </div>
                    <div className={styles.lineaBody}>
                      <h3>{l.nombre}</h3>
                      <p>{l.descripcion}</p>
                      <span className={styles.arrow}>Ver productos →</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {subcats.length > 0 && (
        <section className={styles.subcatFilters}>
          <div className="container container-wide">
            <div className={styles.chipsRow}>
              <span className={`${styles.chip} ${styles.chipActive}`}>Ver todo</span>
              {subcats.map((s) => (
                <Link
                  key={s.slug}
                  href={`/productos/${cat.slug}/${s.slug}`}
                  className={styles.chip}
                >
                  {s.nombre}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {productos.length > 0 ? (
        <section className={`section ${styles.productsSection}`}>
          <div className="container container-wide">
            <div className={styles.sectionHead}>
              <h2>{productos.length} productos en {cat.nombre}</h2>
              <p>Click en cualquier producto para ver la ficha completa y comprar en Mercado Libre.</p>
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
                        {p.marca && <span className={styles.productMarca}>{p.marca.nombre}</span>}
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
              <h2>Aún no hay productos cargados en esta categoría</h2>
              <p>Nuestro equipo puede enviarte el catálogo por WhatsApp o email.</p>
              <div className={styles.emptyActions}>
                <Link href="/contacto" className={styles.btnPrimary}>Pedir catálogo</Link>
                <a
                  href={`https://wa.me/5212291406981?text=${encodeURIComponent(`Hola, me interesa ver los productos de ${cat.nombre}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnGhost}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={`section ${styles.otrasSection}`}>
        <div className="container container-wide">
          <div className={styles.sectionHead}>
            <h2>Otras categorías</h2>
          </div>
          <ul className={styles.otrasGrid}>
            {otras.map((o) => (
              <li key={o.slug}>
                <Link href={`/productos/${o.slug}`} className={styles.otraCard}>
                  <Image src={o.image} alt={o.nombre} width={80} height={80} />
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
