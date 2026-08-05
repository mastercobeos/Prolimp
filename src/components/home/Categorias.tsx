import Image from "next/image";
import Link from "next/link";
import styles from "./Categorias.module.css";

type Categoria = { slug: string; nombre: string; descripcion: string; image: string; destacada?: boolean };
type Props = { categorias: Categoria[] };

export function Categorias({ categorias }: Props) {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container container-wide">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Catálogo</span>
          <h2>Encuentra por categoría</h2>
          <p>Explora nuestro catálogo completo por tipo de producto.</p>
        </div>
        <ul className={styles.grid}>
          {categorias.map((c) => (
            <li key={c.slug}>
              <Link href={`/productos/${c.slug}`} className={styles.card}>
                <div className={styles.imgWrap}>
                  <Image src={c.image} alt={c.nombre} width={300} height={300} />
                </div>
                <h3>{c.nombre}</h3>
                <p>{c.descripcion}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
