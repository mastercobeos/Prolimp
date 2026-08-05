import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { getSistemasDilucion } from "@/lib/data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sistemas de Dilución",
  description:
    "Sistemas de dosificación y de dilución de limpiadores químicos Prolimp. Reduce costos, prolonga la vida útil de tus concentrados y optimiza el uso de químicos.",
};

export const revalidate = 60;

export default async function SistemasDilucionPage() {
  const data = await getSistemasDilucion();
  if (!data) {
    return (
      <main className={styles.page}>
        <section className={styles.empty}>
          <h1>Sistemas de Dilución</h1>
          <p>El contenido aún no ha sido publicado en Sanity. Ve a /studio → Sistemas de Dilución.</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Optimización de químicos</span>
          <h1 className={styles.title}>{data.titulo}</h1>
          {data.descripcion && <p className={styles.subtitle}>{data.descripcion}</p>}
        </div>
        {data.heroImagen && (
          <div className={styles.heroImageWrap}>
            <Image src={data.heroImagen} alt={data.titulo} width={1200} height={720} priority className={styles.heroImage} />
          </div>
        )}
      </header>

      {data.intro && data.intro.length > 0 && (
        <section className={styles.section}>
          <div className={styles.prose}>
            <PortableText value={data.intro as never} />
          </div>
        </section>
      )}

      {data.beneficios.length > 0 && (
        <section className={styles.section}>
          <h2>Beneficios clave</h2>
          <ul className={styles.benefitList}>
            {data.beneficios.map((b, i) => (
              <li key={i}>
                <span className={styles.check} aria-hidden>✓</span>
                {b}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.secciones.map((s, i) => (
        <section key={i} className={styles.sectionSplit}>
          <div>
            <h2>{s.titulo}</h2>
            <div className={styles.prose}>
              <PortableText value={s.contenido as never} />
            </div>
          </div>
          {s.imagen && (
            <div className={styles.sectionImageWrap}>
              <Image src={s.imagen} alt={s.titulo} width={800} height={520} className={styles.sectionImage} />
            </div>
          )}
        </section>
      ))}

      {data.galeria.length > 0 && (
        <section className={styles.section}>
          <h2>Galería</h2>
          <div className={styles.galleryGrid}>
            {data.galeria.map((src, i) => (
              <div key={i} className={styles.galleryItem}>
                <Image src={src} alt="" width={480} height={360} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
