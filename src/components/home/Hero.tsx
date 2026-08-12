"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./Hero.module.css";

type Slide = { url: string; ctaLabel?: string; ctaHref?: string };

type Props = {
  eyebrow: string;
  titulo1: string;
  tituloAcento: string;
  lede: string;
  imagenes: Slide[];
  stats: { valor: string; etiqueta: string }[];
};

const AUTOPLAY_MS = 5000;

export function Hero({ eyebrow, titulo1, tituloAcento, lede, imagenes, stats }: Props) {
  const [index, setIndex] = useState(0);
  const hasSlider = imagenes.length > 1;

  useEffect(() => {
    if (!hasSlider) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % imagenes.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [hasSlider, imagenes.length]);

  const goPrev = () => setIndex((i) => (i - 1 + imagenes.length) % imagenes.length);
  const goNext = () => setIndex((i) => (i + 1) % imagenes.length);

  return (
    <section className={styles.hero}>
      <div className={styles.heroBg} aria-hidden />
      <div className={`container container-wide ${styles.inner}`}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>
            <span className={styles.dot} />
            {eyebrow}
          </span>
          <h1>
            {titulo1}
            <span className={styles.accent}> {tituloAcento}</span>
          </h1>
          <p className={styles.lede}>{lede}</p>
          <div className={styles.actions}>
            <Link href="/productos" className={styles.btnPrimary}>
              Ver catálogo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/contacto" className={styles.btnGhost}>
              Solicitar cotización
            </Link>
          </div>
          <ul className={styles.stats}>
            {stats.map((s) => (
              <li key={s.valor + s.etiqueta}>
                <strong>{s.valor}</strong>
                <span>{s.etiqueta}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual}>
          <div
            className={styles.imgWrap}
            aria-roledescription={hasSlider ? "carousel" : undefined}
          >
            {imagenes.map((slide, i) => (
              <Image
                key={slide.url}
                src={slide.url}
                alt="Imagen hero Prolimp"
                width={640}
                height={720}
                priority={i === 0}
                className={clsx(styles.mainImg, i === index && styles.mainImgActive)}
                aria-hidden={i !== index}
              />
            ))}
            {imagenes[index]?.ctaLabel && imagenes[index]?.ctaHref && (
              (() => {
                const href = imagenes[index]!.ctaHref!;
                const label = imagenes[index]!.ctaLabel!;
                const external = /^https?:\/\//.test(href);
                return external ? (
                  <a
                    key={`cta-${index}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.slideCta}
                  >
                    {label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </a>
                ) : (
                  <Link key={`cta-${index}`} href={href} className={styles.slideCta}>
                    {label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })()
            )}
            {hasSlider && (
              <>
                <button
                  type="button"
                  className={clsx(styles.arrow, styles.arrowPrev)}
                  onClick={goPrev}
                  aria-label="Imagen anterior"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={clsx(styles.arrow, styles.arrowNext)}
                  onClick={goNext}
                  aria-label="Imagen siguiente"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </>
            )}
          </div>
          {hasSlider && (
            <div className={styles.dots} role="tablist" aria-label="Slider hero">
              {imagenes.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Ir a slide ${i + 1}`}
                  className={clsx(styles.dotBtn, i === index && styles.dotBtnActive)}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          )}
          <div className={styles.badge}>
            <span>Certificados</span>
            <strong>ISO 9000</strong>
          </div>
          <div className={styles.badge2}>
            <span>Registrados en</span>
            <strong>STPS y Sec. de Salud</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
