"use client";

import { useState } from "react";
import styles from "./NewsletterForm.module.css";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, origen: "footer" }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Error desconocido");
      setStatus("ok");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg((err as Error).message);
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label htmlFor="newsletter-email" className={styles.label}>
        Recibe novedades y promociones
      </label>
      <div className={styles.inputRow}>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          className={styles.input}
          disabled={status === "loading"}
        />
        <button type="submit" className={styles.button} disabled={status === "loading" || !email}>
          {status === "loading" ? "..." : "Suscribirme"}
        </button>
      </div>
      {status === "ok" && <p className={styles.msgOk}>✓ ¡Gracias! Te avisaremos de novedades.</p>}
      {status === "error" && <p className={styles.msgErr}>{errorMsg || "Hubo un error, intenta de nuevo."}</p>}
    </form>
  );
}
