import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import styles from "./Lineas.module.css";

type Linea = { slug: string; nombre: string; descripcion: string; image: string };
type Props = { lineas: Linea[] };

/* Color de etiqueta por línea (mockup 2026). Fallback: azul corporativo. */
const colorBySlug: Record<string, string> = {
  lavanderia: "#b5177c",
  banos: "#1793d1",
  cocina: "#f07818",
  higiene: "#39b8cb",
  "control-aromas": "#4a2e8f",
  automotriz: "#8a8f98",
  albercas: "#0fa795",
  especializados: "#5a5f66",
  "aseo-general": "#93ac9c",
  pisos: "#e52330",
  industrial: "#6b4a38",
  plec: "#002072",
};

export function Lineas({ lineas }: Props) {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container container-wide">
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Somos fabricantes</span>
            <h2>{lineas.length} líneas de limpiadores químicos propios</h2>
            <p>
              Fórmulas específicas para cada superficie, tipo de suciedad y ambiente de trabajo.
              Además, contamos con PLEC, nuestra marca propia enfocada en productos funcionales y
              soluciones de limpieza pensadas para el ahorro.
            </p>
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
                </div>
                <div
                  className={clsx(styles.label)}
                  style={{ backgroundColor: colorBySlug[l.slug] ?? "#0274c5" }}
                >
                  <h3>{l.nombre}</h3>
                  <span className={styles.arrow}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
