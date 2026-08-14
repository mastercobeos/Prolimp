import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import { getEmpresa } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para solicitar cotización, asesoría técnica o distribución de productos de limpieza Prolimp por WhatsApp, email o en nuestras sucursales.",
};

export default async function ContactoPage() {
  const empresa = await getEmpresa();
  return (
    <section className={styles.section}>
      <div className="container container-wide">
        <header className={styles.head}>
          <span className={styles.eyebrow}>Contáctanos</span>
          <h1>¿Cómo podemos ayudarte?</h1>
          <p>Solicita cotización, agenda una asesoría o pregunta lo que necesites saber.</p>
        </header>

        <div className={styles.grid}>
          <div className={styles.info}>
            <a
              href={`https://wa.me/${empresa.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.channel}
            >
              <div className={styles.icon} style={{ background: "linear-gradient(135deg, #25d366, #128c7e)" }}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="currentColor" aria-hidden>
                  <path d="M16 2C8.28 2 2 8.28 2 16c0 2.51.66 4.98 1.92 7.15L2 30l7.03-1.85A13.94 13.94 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2Z"/>
                </svg>
              </div>
              <div>
                <strong>WhatsApp</strong>
                <span>{empresa.whatsappDisplay}</span>
                <em>Respuesta inmediata en horario hábil</em>
              </div>
            </a>

            <a href={`mailto:${empresa.email}`} className={styles.channel}>
              <div className={styles.icon} style={{ background: "linear-gradient(135deg, var(--azul-500), var(--azul-700))" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 5L2 7" />
                </svg>
              </div>
              <div>
                <strong>Email</strong>
                <span>{empresa.email}</span>
                <em>Cotizaciones y ventas</em>
              </div>
            </a>

            <Link href="/sucursales" className={styles.channel}>
              <div className={styles.icon} style={{ background: "linear-gradient(135deg, var(--cyan-400), var(--azul-500))" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <strong>Sucursales</strong>
                <em>Encuentra la más cercana</em>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
