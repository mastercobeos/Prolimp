"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import styles from "./SearchBox.module.css";

type Result = {
  _id: string;
  nombre: string;
  slug: string;
  sku?: string;
  descripcionCorta?: string;
  imagen?: string;
  categoria?: { nombre: string; slug: string };
  marca?: string;
};

const EXAMPLES = ["pinolimp", "gel antibacterial", "cera pisos", "cloro"];

export function SearchBox() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState<{ left: number; width: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Desktop: la barra ocupa solo el hueco entre el fin del menú (Contacto) y el borde
  // derecho del pill. En móvil (nav oculto) se usa el layout CSS de ancho completo.
  useEffect(() => {
    if (!open) { setPos(null); return; }
    const measure = () => {
      // The nav element is flex-stretched, so its right edge includes empty space;
      // the real boundary is the last menu link (Contacto).
      const links = document.querySelectorAll("header nav > ul > li > a");
      const lastLink = links[links.length - 1];
      const pill = document.querySelector("header > div");
      if (!lastLink || !pill || window.innerWidth <= 960) { setPos(null); return; }
      const linkRight = lastLink.getBoundingClientRect().right;
      const pillRight = pill.getBoundingClientRect().right - 16;
      let left = linkRight + 12;
      let width = pillRight - left;
      if (width < 180) { width = 180; left = pillRight - width; }
      setPos({ left, width });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open]);

  // Marca body cuando search está abierto — usado por Header para ocultarse
  useEffect(() => {
    if (open && !closing) {
      document.body.setAttribute("data-search-open", "true");
    } else {
      document.body.removeAttribute("data-search-open");
    }
    return () => document.body.removeAttribute("data-search-open");
  }, [open, closing]);

  const close = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setQ("");
      setResults([]);
    }, 260);
  };

  useEffect(() => {
    if (open && !closing) inputRef.current?.focus();
  }, [open, closing]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) { setResults([]); return; }
    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        setResults(json.results || []);
      } catch { setResults([]); }
      setLoading(false);
    }, 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showResults = !loading && q.length >= 2 && results.length > 0;
  const showEmpty = !loading && q.length >= 2 && results.length === 0;
  const showHint = !loading && q.length < 2;

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label="Buscar productos"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="7"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
      </button>

      {open && mounted && createPortal(
        <div className={styles.overlay} onClick={close}>
          <div
            className={`${styles.container} ${closing ? styles.closing : ""}`}
            style={pos ? { left: pos.left, right: "auto", width: pos.width, transform: "none" } : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.bar}>
              <input
                ref={inputRef}
                type="search"
                placeholder="Buscar producto..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className={styles.input}
                autoComplete="off"
              />
              <button className={styles.closeBtn} onClick={close} aria-label="Cerrar buscador">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {(loading || showResults || showEmpty) && (
              <div className={styles.dropdown}>
                {loading && (
                  <div className={styles.spinnerWrap}>
                    <span className={styles.spinner} />
                    Buscando...
                  </div>
                )}

                {showEmpty && (
                  <div className={styles.status}>
                    Sin resultados para &ldquo;{q}&rdquo;
                  </div>
                )}

                {showResults && (
                  <div className={styles.results}>
                    <div className={styles.resultsHeader}>
                      {results.length} {results.length === 1 ? "resultado" : "resultados"}
                    </div>
                    <ul>
                      {results.map((r) => (
                        <li key={r._id}>
                          <Link href={`/producto/${r.slug}`} onClick={() => setOpen(false)} className={styles.resultRow}>
                            {r.imagen ? (
                              <Image src={r.imagen} alt="" width={36} height={36} className={styles.thumb} />
                            ) : (
                              <div className={styles.thumbPh} />
                            )}
                            <div className={styles.resultBody}>
                              <div className={styles.resultTitle}>{r.nombre}</div>
                              <div className={styles.resultMeta}>
                                {r.marca && <span>{r.marca}</span>}
                                {r.categoria && <span>{r.categoria.nombre}</span>}
                                {r.sku && <span className={styles.resultSku}>{r.sku}</span>}
                              </div>
                            </div>
                            <svg className={styles.resultArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="m9 18 6-6-6-6"/>
                            </svg>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
