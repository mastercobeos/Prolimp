"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./CookieBanner.module.css";

const KEY = "prolimp-cookies-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(KEY) : "1";
    if (!saved) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(KEY, "accepted");
    setVisible(false);
  };
  const reject = () => {
    localStorage.setItem(KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-labelledby="cookie-title">
      <div className={styles.inner}>
        <div className={styles.text}>
          <p id="cookie-title" className={styles.title}>
            Usamos cookies 🍪
          </p>
          <p className={styles.desc}>
            Utilizamos cookies para mejorar tu navegación, medir el tráfico y personalizar contenido.
            Puedes leer más en nuestro{" "}
            <Link href="/aviso-de-privacidad" className={styles.link}>aviso de privacidad</Link>.
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.reject} onClick={reject}>Rechazar</button>
          <button className={styles.accept} onClick={accept}>Aceptar todas</button>
        </div>
      </div>
    </div>
  );
}
