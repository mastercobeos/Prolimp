import Image from "next/image";
import Link from "next/link";
import styles from "./Lineas.module.css";

type Linea = { slug: string; nombre: string; descripcion: string; image: string };
type Props = { lineas: Linea[] };

export function Lineas({ lineas }: Props) {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container container-wide">
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Somos fabricantes</span>
            <h2>{lineas.length} líneas de químicos propios</h2>
            <p>Fórmulas específicas para cada superficie, tipo de suciedad y ambiente de trabajo.</p>
          </div>
          <Link href="/productos/quimicos" className={styles.viewAll}>
            Ver todas las líneas →
          </Link>
        </div>

        <ul className={styles.grid}>
          {lineas.map((l) => (
            <li key={l.slug}>
              <Link href={`/productos/quimicos/${l.slug}`} className={styles.card}>
                <div className={styles.imgWrap}>
                  <Image src={l.image} alt={l.nombre} width={400} height={460} />
                  <div className={styles.overlay} />
                </div>
                <div className={styles.content}>
                  <h3>{l.nombre}</h3>
                  <p>{l.descripcion}</p>
                  <span className={styles.arrow}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
