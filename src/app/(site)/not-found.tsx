import Link from "next/link";
import type { Metadata } from "next";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className={styles.wrap}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.eyebrow}>Error 404</span>
        <p className={styles.code} aria-hidden>
          4<span className={styles.drop}>0</span>4
        </p>
        <h1>Esta página no existe o cambió de lugar</h1>
        <p className={styles.lede}>
          Puede que el enlace esté mal escrito o que el contenido se haya movido.
          Prueba desde el inicio o explora nuestro catálogo.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.btnPrimary}>
            Ir al inicio
          </Link>
          <Link href="/productos" className={styles.btnGhost}>
            Ver catálogo
          </Link>
          <Link href="/contacto" className={styles.btnGhost}>
            Contacto
          </Link>
        </div>
      </div>
    </section>
  );
}
