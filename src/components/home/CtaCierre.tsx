import Link from "next/link";
import styles from "./CtaCierre.module.css";

type Props = {
  titulo?: string;
  lede?: string;
};

export function CtaCierre({ titulo, lede }: Props) {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.box}>
          <div className={styles.content}>
            <h2>{titulo ?? "¿Listo para elevar el estándar de limpieza de tu empresa?"}</h2>
            <p>
              {lede ??
                "Nuestros asesores institucionales te ayudan a elegir los productos ideales para tu operación. Cotización sin compromiso."}
            </p>
          </div>
          <div className={styles.actions}>
            <Link href="/contacto" className={styles.btnPrimary}>Solicitar cotización</Link>
            <a href="/pdf/catalogo-prolimp.pdf" download className={styles.btnCatalog}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descarga Catálogo PDF
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
