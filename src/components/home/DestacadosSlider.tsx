"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./DestacadosSlider.module.css";

type Producto = {
  _id: string;
  nombre: string;
  slug: string;
  sku?: string;
  descripcionCorta?: string;
  imagen?: string;
  marca?: string;
  categoria?: { nombre: string; slug: string };
};

export function DestacadosSlider({ productos }: { productos: Producto[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateNav = () => {
    const t = trackRef.current;
    if (!t) return;
    setCanPrev(t.scrollLeft > 4);
    setCanNext(t.scrollLeft < t.scrollWidth - t.clientWidth - 4);
  };

  useEffect(() => {
    updateNav();
    const t = trackRef.current;
    if (!t) return;
    t.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    return () => {
      t.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", updateNav);
    };
  }, []);

  const scroll = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    t.scrollBy({ left: dir * t.clientWidth * 0.85, behavior: "smooth" });
  };

  if (productos.length === 0) return null;

  return (
    <section className={`section ${styles.section}`}>
      <div className="container container-wide">
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>Productos destacados</span>
            <h2>Lo más solicitado</h2>
          </div>
          <div className={styles.controls}>
            <button className={styles.navBtn} onClick={() => scroll(-1)} disabled={!canPrev} aria-label="Anterior">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18 9 12l6-6"/></svg>
            </button>
            <button className={styles.navBtn} onClick={() => scroll(1)} disabled={!canNext} aria-label="Siguiente">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <div className={styles.track} ref={trackRef}>
          {productos.map((p) => (
            <Link key={p._id} href={`/producto/${p.slug}`} className={styles.card}>
              <div className={styles.imgWrap}>
                {p.imagen ? (
                  <Image src={p.imagen} alt={p.nombre} width={300} height={300} className={styles.img} />
                ) : (
                  <div className={styles.imgPh} />
                )}
              </div>
              <div className={styles.body}>
                {p.marca && <span className={styles.marca}>{p.marca}</span>}
                <h3>{p.nombre}</h3>
                {p.descripcionCorta && <p>{p.descripcionCorta}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
