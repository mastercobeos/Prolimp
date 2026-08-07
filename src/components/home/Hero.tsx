import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

type Props = {
  eyebrow: string;
  titulo1: string;
  tituloAcento: string;
  lede: string;
  imagen: string;
  stats: { valor: string; etiqueta: string }[];
};

export function Hero({ eyebrow, titulo1, tituloAcento, lede, imagen, stats }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg} aria-hidden />
      <div className={styles.bgOrbs} aria-hidden />
      <div className={`container container-wide ${styles.inner}`}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>
            <span className={styles.dot} />
            {eyebrow}
          </span>
          <h1>
            {titulo1}
            <span className={styles.accent}> {tituloAcento}</span>
          </h1>
          <p className={styles.lede}>{lede}</p>
          <div className={styles.actions}>
            <Link href="/productos" className={styles.btnPrimary}>
              Ver catálogo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/contacto" className={styles.btnGhost}>
              Solicitar cotización
            </Link>
          </div>
          <a href="/pdf/catalogo-prolimp.pdf" download className={styles.catalogLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Descargar catálogo PDF
          </a>
          <ul className={styles.stats}>
            {stats.map((s) => (
              <li key={s.valor + s.etiqueta}>
                <strong>{s.valor}</strong>
                <span>{s.etiqueta}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual}>
          <div className={styles.imgWrap}>
            <Image
              src={imagen}
              alt="Personal de limpieza profesional Prolimp"
              width={640}
              height={720}
              priority
              className={styles.mainImg}
            />
          </div>
          <div className={styles.badge}>
            <span>Certificados</span>
            <strong>ISO 9001</strong>
          </div>
          <div className={styles.badge2}>
            <span>Registrados en</span>
            <strong>STPS · Sec. Salud</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
