import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategorias, getProductosBySubcategoria } from "@/lib/data";
import { getSubcategoria, getSubcategorias, getAllSubcategoriaParams } from "@/lib/subcategorias";
import { urlForImage } from "@/sanity/image";
import styles from "../page.module.css";

type Params = { categoria: string; subcategoria: string };

export const revalidate = 60;

export async function generateStaticParams() {
  return getAllSubcategoriaParams();
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { categoria, subcategoria } = await params;
  const cats = await getCategorias();
  const cat = cats.find((c) => c.slug === categoria);
  const sub = getSubcategoria(categoria, subcategoria);
  if (!cat || !sub) return {};
  return {
    title: `${sub.nombre} · ${cat.nombre}`,
    description: `Catálogo de ${sub.nombre} en la categoría ${cat.nombre}. Cotización sin compromiso.`,
  };
}

export default async function SubcategoriaPage({ params }: { params: Promise<Params> }) {
  const { categoria, subcategoria } = await params;
  const [cats, sub] = [await getCategorias(), getSubcategoria(categoria, subcategoria)];
  const cat = cats.find((c) => c.slug === categoria);
  if (!cat || !sub) return notFound();

  const productos = await getProductosBySubcategoria(categoria, sub.slug, sub.nombre);
  const subcats = getSubcategorias(categoria);

  return (
    <>
      <section className={styles.hero}>
        <div className="container container-wide">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Inicio</Link>
            <span>/</span>
            <Link href="/productos">Productos</Link>
            <span>/</span>
            <Link href={`/productos/${cat.slug}`}>{cat.nombre}</Link>
            <span>/</span>
            <span aria-current="page">{sub.nombre}</span>
          </nav>
          <div className={styles.heroInner}>
            <div>
              <span className={styles.eyebrow}>{cat.nombre}</span>
              <h1>{sub.nombre}</h1>
              <p>{productos.length} {productos.length === 1 ? "producto" : "productos"} en esta sección.</p>
              <div className={styles.actions}>
                <Link href="/contacto" className={styles.btnPrimary}>Solicitar cotización</Link>
                <Link href={`/productos/${cat.slug}`} className={styles.btnGhost}>Ver toda {cat.nombre}</Link>
              </div>
            </div>
            <div className={styles.heroImg}>
              <Image src={cat.image} alt={cat.nombre} width={400} height={400} priority />
            </div>
          </div>
        </div>
      </section>

      {subcats.length > 1 && (
        <section className={styles.subcatFilters}>
          <div className="container container-wide">
            <div className={styles.chipsRow}>
              <Link href={`/productos/${cat.slug}`} className={styles.chip}>
                Ver todo
              </Link>
              {subcats.map((s) => (
                <Link
                  key={s.slug}
                  href={`/productos/${cat.slug}/${s.slug}`}
                  className={`${styles.chip} ${s.slug === sub.slug ? styles.chipActive : ""}`}
                >
                  {s.nombre}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`section ${styles.productsSection}`}>
        <div className="container container-wide">
          {productos.length > 0 ? (
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
          ) : (
            <div className={styles.emptyBox}>
              <div className={styles.emptyIcon}>📦</div>
              <h2>Aún no hay productos cargados en {sub.nombre}</h2>
              <p>Nuestro equipo puede enviarte información por WhatsApp o email.</p>
              <div className={styles.emptyActions}>
                <Link href="/contacto" className={styles.btnPrimary}>Pedir catálogo</Link>
                <a
                  href={`https://wa.me/5212291406981?text=${encodeURIComponent(`Hola, me interesa ${sub.nombre}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnGhost}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
