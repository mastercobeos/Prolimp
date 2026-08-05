"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";

type Props = { whatsapp: string };

export function ContactForm({ whatsapp }: Props) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const msg = [
      `Hola Prolimp, soy ${data.get("nombre")} de ${data.get("empresa") || "particular"}.`,
      `Ciudad: ${data.get("ciudad")}`,
      `Email: ${data.get("email")}`,
      `Mensaje: ${data.get("mensaje")}`,
    ].join("\n");
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setSent(true);
  };

  if (sent) {
    return (
      <div className={styles.success}>
        <span className={styles.check}>✓</span>
        <h3>Mensaje enviado por WhatsApp</h3>
        <p>Se abrió una ventana con tu mensaje listo para enviar. En breve te contactamos.</p>
        <button type="button" onClick={() => setSent(false)} className={styles.reset}>
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label>
          <span>Nombre completo *</span>
          <input name="nombre" type="text" required autoComplete="name" />
        </label>
        <label>
          <span>Empresa</span>
          <input name="empresa" type="text" autoComplete="organization" />
        </label>
      </div>
      <div className={styles.row}>
        <label>
          <span>Email *</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          <span>Ciudad *</span>
          <input name="ciudad" type="text" required />
        </label>
      </div>
      <label>
        <span>¿En qué podemos ayudarte? *</span>
        <textarea name="mensaje" rows={4} required placeholder="Cuéntanos qué productos o servicios necesitas..." />
      </label>
      <label className={styles.checkbox}>
        <input name="privacy" type="checkbox" required />
        <span>Acepto el <a href="/aviso-de-privacidad">aviso de privacidad</a> *</span>
      </label>
      <button type="submit" className={styles.submit}>Enviar por WhatsApp</button>
    </form>
  );
}
