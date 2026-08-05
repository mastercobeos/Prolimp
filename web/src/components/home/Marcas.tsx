import Image from "next/image";
import Link from "next/link";
import styles from "./Marcas.module.css";

type Marca = { slug: string; nombre: string; image: string; productos: number };
type Props = { marcas: Marca[] };

export function Marcas({ marcas }: Props) {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container container-wide">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Aliados estratégicos</span>
          <h2>Distribuimos las marcas más reconocidas del sector</h2>
          <p>Además de nuestra marca propia, somos distribuidores autorizados de líderes globales.</p>
        </div>
        <ul className={styles.grid}>
          {marcas.map((m) => (
            <li key={m.slug}>
              <Link href={`/productos/marcas/${m.slug}`} className={styles.card}>
                <Image src={m.image} alt={m.nombre} width={200} height={200} />
                <div className={styles.info}>
                  <strong>{m.nombre}</strong>
                  <span>{m.productos} productos</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
