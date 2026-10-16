import type { Metadata } from "next";
import PrivacyNotice from "./PrivacyNotice";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Avisos de privacidad de Prolimp del Centro y Prolimpieza conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "16 de octubre de 2026";

const NOTICES = [
  { name: "Prolimp", legalName: "Prolimp del Centro, S.A. de C.V.", address: "Orizaba, Veracruz, México" },
  { name: "Prolimpieza", legalName: "Prolimpieza, S.A. de C.V.", address: "Querétaro, Qro. México" },
];

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
          <details key={n.name} className={styles.notice}>
            <summary className={styles.summary}>
              <h2>{n.name}</h2>
              <span className={styles.summaryHint}>Aviso de privacidad</span>
            </summary>
            <div className={styles.noticeBody}>
              <PrivacyNotice legalName={n.legalName} address={n.address} />
            </div>
          </details>
        ))}
      </article>
    </main>
  );
}
