"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./ProductosSearch.module.css";

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

export function ProductosSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        setResults(json.results || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  const showDropdown = focused && q.trim().length >= 2;
  const hasResults = results.length > 0;

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.bar}>
        <svg
          className={styles.icon}
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          className={styles.input}
          placeholder="Busca por nombre, SKU o descripción…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          autoComplete="off"
        />
        {q && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => {
              setQ("");
              setResults([]);
            }}
            aria-label="Limpiar búsqueda"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <div className={styles.dropdown}>
          {loading && (
            <div className={styles.status}>
              <span className={styles.spinner} />
              Buscando…
            </div>
          )}
          {!loading && !hasResults && (
            <div className={styles.status}>Sin resultados para “{q}”.</div>
          )}
          {!loading && hasResults && (
            <>
              <div className={styles.header}>
                {results.length} {results.length === 1 ? "resultado" : "resultados"}
              </div>
              <ul className={styles.results}>
                {results.map((r) => (
                  <li key={r._id}>
                    <Link
                      href={`/producto/${r.slug}`}
                      onClick={() => setFocused(false)}
                      className={styles.row}
                    >
                      {r.imagen ? (
                        <Image
                          src={r.imagen}
                          alt=""
                          width={44}
                          height={44}
                          className={styles.thumb}
                        />
                      ) : (
                        <div className={styles.thumbPh} />
                      )}
                      <div className={styles.body}>
                        <div className={styles.title}>{r.nombre}</div>
                        <div className={styles.meta}>
                          {r.marca && <span>{r.marca}</span>}
                          {r.categoria && <span>{r.categoria.nombre}</span>}
                          {r.sku && <span className={styles.sku}>{r.sku}</span>}
                        </div>
                      </div>
                      <svg className={styles.arrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
