"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WhatsAppButton.module.css";

type Props = {
  whatsapp: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
};

export function WhatsAppButton({ whatsapp, facebook, instagram, linkedin, youtube }: Props) {
  const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    "Hola, me interesa cotizar productos de limpieza Prolimp."
  )}`;

  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastY.current;
      if (y > 140 && diff > 10) setHidden(true);
      else if (diff < -8 || y < 80) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`${styles.stack} ${hidden ? styles.hidden : ""}`}>
      {youtube && (
        <a
          href={youtube}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.button} ${styles.youtube}`}
          aria-label="YouTube"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.5 6.19a3 3 0 0 0-2.11-2.13C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.39.56A3 3 0 0 0 .5 6.19 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.81 3 3 0 0 0 2.11 2.13C4.49 20.5 12 20.5 12 20.5s7.51 0 9.39-.56a3 3 0 0 0 2.11-2.13A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.81ZM9.6 15.6V8.4l6.24 3.6Z"/>
          </svg>
        </a>
      )}
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.button} ${styles.linkedin}`}
          aria-label="LinkedIn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33 0-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.4v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.11 2.06 2.06 0 0 1 0 4.11zm-1.78 13.02h3.55V9H3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z"/>
          </svg>
        </a>
      )}
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.button} ${styles.instagram}`}
          aria-label="Instagram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.22.06 1.27.07 1.65.07 4.86s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63a5.86 5.86 0 0 0-2.13 1.38A5.86 5.86 0 0 0 .63 4.14C.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91.3.78.7 1.44 1.38 2.13a5.86 5.86 0 0 0 2.13 1.38c.76.29 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56a5.86 5.86 0 0 0 2.13-1.38 5.86 5.86 0 0 0 1.38-2.13c.29-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.13A5.86 5.86 0 0 0 19.86.63C19.1.34 18.22.13 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z"/>
          </svg>
        </a>
      )}
      {facebook && (
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.button} ${styles.facebook}`}
          aria-label="Facebook"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.5h-2.79V24C19.61 23.09 24 18.1 24 12.07"/>
          </svg>
        </a>
      )}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.button} ${styles.whatsapp}`}
        aria-label="WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="M16 2C8.28 2 2 8.28 2 16c0 2.51.66 4.98 1.92 7.15L2 30l7.03-1.85A13.94 13.94 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2Zm7.5 19.14c-.31.88-1.57 1.66-2.28 1.77-.62.09-1.4.13-2.26-.14-.52-.16-1.19-.38-2.05-.75-3.6-1.55-5.94-5.17-6.12-5.41-.18-.24-1.46-1.94-1.46-3.7 0-1.75.92-2.62 1.24-2.97.32-.35.7-.44.94-.44h.68c.22 0 .5-.08.79.6.31.72 1.04 2.5 1.13 2.68.09.18.15.4.03.64-.12.24-.18.4-.37.62-.19.22-.4.5-.57.67-.19.19-.4.4-.17.78.22.38 1 1.63 2.14 2.65 1.47 1.3 2.7 1.7 3.09 1.9.38.19.6.16.83-.1.22-.26.95-1.11 1.2-1.5.25-.38.5-.32.85-.19.36.13 2.28 1.08 2.67 1.27.39.19.65.29.75.45.09.16.09.94-.22 1.82Z"/>
        </svg>
      </a>
    </div>
  );
}
