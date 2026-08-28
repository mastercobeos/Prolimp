"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./Hero.module.css";

type Slide = { url: string; caption?: string; ctaLabel?: string; ctaHref?: string };

type Props = {
  eyebrow: string;
  titulo1: string;
  tituloAcento: string;
  lede: string;
  imagenes: Slide[];
  stats: { valor: string; etiqueta: string }[];
};

const AUTOPLAY_MS = 5000;

/* The hero image renders at most 480 CSS px wide on tablets/phones and ~45vw on
   desktop; Sanity resizes on the fly via `w=`, so the browser can pick the
   closest width for its DPR instead of always pulling the 1600 px version. */
const HERO_IMG_WIDTHS = [480, 640, 960, 1280, 1600];
const HERO_IMG_SIZES = "(max-width: 1024px) min(100vw, 480px), 45vw";

function sanitySrcSet(url: string): string {
  return HERO_IMG_WIDTHS.map((w) => {
    const u = new URL(url);
    u.searchParams.set("w", String(w));
    return `${u.toString()} ${w}w`;
  }).join(", ");
}

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
            <Link href="/contacto" className={styles.btnPrimary}>
              Contactar Asesor
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/productos" className={styles.btnGhost}>
              Ver catálogo
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
          <div className={styles.imgArea}>
            <div
              className={styles.imgWrap}
              aria-roledescription={hasSlider ? "carousel" : undefined}
            >
              {imagenes.map((slide, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={slide.url}
                  src={slide.url}
                  srcSet={sanitySrcSet(slide.url)}
                  sizes={HERO_IMG_SIZES}
                  alt="Imagen hero Prolimp"
                  width={640}
                  height={720}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : undefined}
                  decoding="async"
                  className={clsx(styles.mainImg, i === index && styles.mainImgActive)}
                  aria-hidden={i !== index}
                />
              ))}
              {imagenes[index]?.ctaHref && (
                (() => {
                  const href = imagenes[index]!.ctaHref!;
                  const label = imagenes[index]!.ctaLabel || "Ver más";
                  const external = /^https?:\/\//.test(href);
                  return external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.slideLinkOverlay}
                      aria-label={label}
                    />
                  ) : (
                    <Link
                      href={href}
                      className={styles.slideLinkOverlay}
                      aria-label={label}
                    />
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
            </div>
            <div className={styles.badge}>
              <span>Certificados</span>
              <strong>ISO 9001</strong>
            </div>
            <div className={styles.badge2}>
              <span>Registrados en</span>
              <strong>STPS y Sec. de Salud</strong>
            </div>
          </div>
          {(imagenes[index]?.caption || (imagenes[index]?.ctaLabel && imagenes[index]?.ctaHref)) && (
            <div className={styles.slideCaption}>
              {imagenes[index]?.caption && <p>{imagenes[index]!.caption}</p>}
              {imagenes[index]?.ctaLabel && imagenes[index]?.ctaHref && (
                (() => {
                  const href = imagenes[index]!.ctaHref!;
                  const label = imagenes[index]!.ctaLabel!;
                  const external = /^https?:\/\//.test(href);
                  return external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.slideCaptionBtn}
                    >
                      {label}
                    </a>
                  ) : (
                    <Link href={href} className={styles.slideCaptionBtn}>
                      {label}
                    </Link>
                  );
                })()
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
