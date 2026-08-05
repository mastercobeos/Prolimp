import Link from "next/link";
import styles from "./CtaCierre.module.css";

type Props = {
  titulo?: string;
  lede?: string;
  whatsapp: string;
};

export function CtaCierre({ titulo, lede, whatsapp }: Props) {
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
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className={styles.btnGhost}>
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
