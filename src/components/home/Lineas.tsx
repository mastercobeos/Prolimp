import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { lineaHref } from "@/lib/lineaHref";
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

/* Orden de las tarjetas según la lámina de Home del mockup (4x3). PLEC va al
   final: es la 12ª tarjeta pero NO cuenta como línea, por eso el encabezado
   dice 11 y aun así se muestran 12. */
const ordenMockup = [
  "lavanderia", "banos", "cocina", "higiene",
  "control-aromas", "automotriz", "albercas", "especializados",
  "aseo-general", "pisos", "industrial", "plec",
];

export function Lineas({ lineas }: Props) {
  const ordenadas = [...lineas].sort(
    (a, b) => ordenMockup.indexOf(a.slug) - ordenMockup.indexOf(b.slug)
  );
  // El conteo del encabezado excluye PLEC ("Además, contamos con PLEC…").
  const totalLineas = lineas.filter((l) => l.slug !== "plec").length;

  return (
    <section className={`section ${styles.section}`}>
      <div className="container container-wide">
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Somos fabricantes</span>
            <h2>{totalLineas} líneas de limpiadores químicos propios</h2>
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
          {ordenadas.map((l) => (
            <li key={l.slug}>
              <Link
                href={lineaHref(l.slug)}
                className={styles.card}
                style={{ "--linea": colorBySlug[l.slug] ?? "#0274c5" } as CSSProperties}
              >
                <div className={styles.imgWrap}>
                  <Image src={l.image} alt={l.nombre} width={900} height={1035} />
                </div>
                <div className={clsx(styles.label)}>
                  <h3>{l.nombre}</h3>
                  <span className={styles.arrow}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M9 6l6 6-6 6" />
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
