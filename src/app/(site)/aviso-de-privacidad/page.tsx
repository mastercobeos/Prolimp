import type { Metadata } from "next";
import Link from "@/components/shared/Link";
import { LAST_UPDATED, NOTICES } from "./notices";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Avisos de privacidad de Prolimp del Centro y Prolimpieza conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
  robots: { index: true, follow: true },
};

export default function AvisoPrivacidadPage() {
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Legal</span>
          <h1>Aviso de privacidad</h1>
          <p className={styles.updated}>Última actualización: {LAST_UPDATED}</p>
        </header>

        {NOTICES.map((n) => (
          <Link key={n.slug} href={`/aviso-de-privacidad/${n.slug}`} className={styles.notice}>
            <h2>{n.name}</h2>
            <span className={styles.noticeHint}>Aviso de privacidad</span>
          </Link>
        ))}
      </article>
    </main>
  );
}
