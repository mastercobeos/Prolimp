"use client";

import { useState } from "react";
import styles from "./DistribuidorForm.module.css";

type Props = { whatsapp: string };

export function DistribuidorForm({ whatsapp }: Props) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const msg = [
      `Hola Prolimp, quiero ser distribuidor.`,
      `Nombre: ${data.get("nombre")} ${data.get("apellido")}`,
      `E-mail: ${data.get("email")}`,
      `Teléfono: ${data.get("telefono")}`,
      `Celular: ${data.get("celular")}`,
      `¿Distribuye o comercializa productos?: ${data.get("distribuye")}`,
      `Giro: ${data.get("giro")}`,
      `Ciudad: ${data.get("ciudad")}`,
    ].join("\n");
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setSent(true);
  };

  if (sent) {
    return (
      <div className={styles.success}>
        <span className={styles.check}>✓</span>
        <h3>Solicitud enviada por WhatsApp</h3>
        <p>Se abrió una ventana con tu solicitud lista para enviar. En breve te contactamos.</p>
        <button type="button" onClick={() => setSent(false)} className={styles.reset}>
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.lede}>Llena el siguiente formulario y envíanos tu solicitud:</p>
      <input name="nombre" type="text" placeholder="Nombre:" required autoComplete="given-name" />
      <input name="apellido" type="text" placeholder="Apellido:" required autoComplete="family-name" />
      <input name="email" type="email" placeholder="E-mail:" required autoComplete="email" />
      <input name="telefono" type="tel" placeholder="Teléfono:" autoComplete="tel" />
      <input name="celular" type="tel" placeholder="Celular:" required autoComplete="tel" />
      <fieldset className={styles.radios}>
        <legend>¿Actualmente distribuyes o comercializas productos?</legend>
        <label>
          <input type="radio" name="distribuye" value="Sí" required />
          <span>Sí</span>
        </label>
        <label>
          <input type="radio" name="distribuye" value="No" />
          <span>No</span>
        </label>
      </fieldset>
      <input name="giro" type="text" placeholder="Giro:" required />
      <input name="ciudad" type="text" placeholder="Ciudad:" required />
      <label className={styles.checkbox}>
        <input name="terminos" type="checkbox" required />
        <span>Acepto los <a href="/terminos-y-condiciones">Términos de Uso</a> *</span>
      </label>
      <button type="submit" className={styles.submit}>Enviar</button>
    </form>
  );
}
