import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import styles from "./CtaBand.module.css";

type Props = {
  titulo: string;
  lede?: string;
  href: string;
  cta?: string;
  external?: boolean;
  /** Nombre de archivo: convierte la banda en descarga directa en vez de navegación. */
  download?: string;
  /** Logo o arte a la derecha de la banda */
  logo?: { src: string; alt: string; width: number; height: number };
  variant?: "azul" | "marino" | "proxter";
};

export function CtaBand({ titulo, lede, href, cta = "Ver más", external, download, logo, variant = "marino" }: Props) {
  const inner = (
    <>
      <div className={styles.text}>
        <h2>{titulo}</h2>
        {lede && <p>{lede}</p>}
      </div>
      <span className={styles.action}>
        {cta}
        <span className={styles.circle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </span>
      </span>
      {logo && (
        <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className={styles.logo} />
      )}
    </>
  );
  const className = clsx(styles.band, styles[variant]);
  return (
    <section className={styles.wrap}>
      {download ? (
        <a href={href} download={download} className={className}>
          {inner}
        </a>
      ) : external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={className}>
          {inner}
        </Link>
      )}
    </section>
  );
}
