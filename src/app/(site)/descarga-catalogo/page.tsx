import type { Metadata } from "next";
import Link from "next/link";
import { catalogoPara } from "@/lib/catalogos";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Descarga catálogo",
  description: "Descarga el catálogo completo de productos Prolimp: químicos, papel, jarcería, dosificadores y más.",
};

export default async function DescargaCatalogoPage() {
  const catalogo = await catalogoPara("general");
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Recurso descargable</span>
        <h1>Catálogo completo Prolimp</h1>
        <p className={styles.lead}>
          Más de 280 productos organizados por categoría: químicos de fabricación propia, papel higiénico,
          jarcería, dosificadores, seguridad y más. Incluye SKU, presentaciones y ficha técnica de cada línea.
        </p>
      </section>

      <section className={styles.card}>
        <div className={styles.cardVisual}>
          <div className={styles.pdfIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
              <path d="M14 2v6h6"/>
              <path d="M9 15v-2h1.5a1.5 1.5 0 0 1 0 3H9"/>
              <path d="M14 13v5"/>
              <path d="M14 13h1.5a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5H14"/>
            </svg>
          </div>
          <div className={styles.cardMeta}>
            <strong>Catálogo Prolimp 2026</strong>
            <span>Formato PDF · Última actualización disponible</span>
          </div>
        </div>
        <div className={styles.cardActions}>
          <a
            href={catalogo.href}
            download={catalogo.nombre}
            className={styles.primaryBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Descargar PDF
          </a>
        </div>
      </section>

      <section className={styles.alt}>
        <h2>¿Prefieres explorar en línea?</h2>
        <p>
          Todo el catálogo está también disponible en nuestra sección de{" "}
          <Link href="/productos">Productos</Link>, organizado por categoría, línea y marca.
          Cada producto tiene su ficha completa con imágenes, presentaciones y opción de cotización directa.
        </p>
        <div className={styles.altActions}>
          <Link href="/productos" className={styles.linkBtn}>Ver catálogo online →</Link>
          <Link href="/contacto" className={styles.linkBtn}>Solicitar cotización →</Link>
        </div>
      </section>
    </main>
  );
}
