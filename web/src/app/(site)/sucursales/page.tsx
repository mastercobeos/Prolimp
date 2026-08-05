import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import { getSucursales, getEmpresa } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sucursales y distribuidores",
  description:
    "Encuentra tu sucursal Prolimp más cercana. Presencia en Veracruz, CDMX, Puebla, Tabasco y más ciudades de México.",
};

export default async function SucursalesPage() {
  const [sucursales, empresa] = await Promise.all([getSucursales(), getEmpresa()]);
  return (
    <section className={styles.section}>
      <div className="container container-wide">
        <header className={styles.head}>
          <span className={styles.eyebrow}>Cobertura nacional</span>
          <h1>Sucursales y distribuidores</h1>
          <p>Presencia estratégica en el centro y sureste de México para atenderte donde estés.</p>
        </header>

        <div className={styles.grid}>
          {sucursales.map((s) => (
            <article key={`${s.ciudad}-${s.estado}`} className={styles.card}>
              <div className={styles.pin}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h2>{s.ciudad}</h2>
              <span className={styles.estado}>{s.estado}</span>
              {s.telefono && <p className={styles.tel}>{s.telefono}</p>}
              <Link href="/contacto" className={styles.linkBtn}>Contactar sucursal</Link>
            </article>
          ))}
        </div>

        <div className={styles.cta}>
          <div>
            <h2>¿No encuentras tu ciudad?</h2>
            <p>Enviamos productos a todo México. Contáctanos para tu cotización personalizada.</p>
          </div>
          <div className={styles.ctaActions}>
            <a
              href={`https://wa.me/${empresa.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              WhatsApp {empresa.whatsappDisplay}
            </a>
            <Link href="/contacto" className={styles.btnGhost}>Formulario de contacto</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
