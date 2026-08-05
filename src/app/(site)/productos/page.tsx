import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { getCategorias, getLineas, getMarcas } from "@/lib/data";

export const metadata: Metadata = {
  title: "Productos y catálogo",
  description:
    "Catálogo completo Prolimp: químicos, higiénicos, dosificadores, jarciería, seguridad, plásticos, detergentes y más. 200+ productos de calidad certificada.",
};

export default async function ProductosPage() {
  const [categorias, lineas, marcas] = await Promise.all([getCategorias(), getLineas(), getMarcas()]);
  return (
    <>
      <section className={styles.hero}>
        <div className="container container-wide">
          <span className={styles.eyebrow}>Catálogo</span>
          <h1>Todos nuestros productos</h1>
          <p>
            Explora por categoría, línea o marca. 200+ productos para cubrir todas las necesidades
            de limpieza profesional.
          </p>
        </div>
      </section>

      <section className={`section ${styles.catsSection}`}>
        <div className="container container-wide">
          <div className={styles.sectionHead}>
            <h2>Explora por categoría</h2>
            <p>Los grandes grupos de productos que manejamos.</p>
          </div>
          <ul className={styles.catGrid}>
            {categorias.map((c) => (
              <li key={c.slug}>
                <Link href={`/productos/${c.slug}`} className={styles.catCard}>
                  <div className={styles.catImg}>
                    <Image src={c.image} alt={c.nombre} width={300} height={300} />
                  </div>
                  <div>
                    <h3>{c.nombre}</h3>
                    <p>{c.descripcion}</p>
                  </div>
                  <span className={styles.arrow}>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`section ${styles.lineasSection}`}>
        <div className="container container-wide">
          <div className={styles.sectionHead}>
            <h2>11 líneas de químicos propios</h2>
            <p>Nuestra fabricación marca <strong>Prolimp®</strong>.</p>
          </div>
          <ul className={styles.lineasGrid}>
            {lineas.map((l) => (
              <li key={l.slug}>
                <Link href={`/productos/quimicos/${l.slug}`} className={styles.lineaChip}>
                  <span className={styles.dot} />
                  {l.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`section ${styles.marcasSection}`}>
        <div className="container container-wide">
          <div className={styles.sectionHead}>
            <h2>Marcas que distribuimos</h2>
            <p>Somos distribuidores autorizados de las principales marcas globales.</p>
          </div>
          <ul className={styles.marcasGrid}>
            {marcas.map((m) => (
              <li key={m.slug}>
                <Link href={`/productos/marcas/${m.slug}`} className={styles.marcaCard}>
                  <Image src={m.image} alt={m.nombre} width={140} height={140} />
                  <strong>{m.nombre}</strong>
                  <span>{m.productos} productos</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
