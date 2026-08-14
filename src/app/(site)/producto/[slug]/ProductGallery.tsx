"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import styles from "./ProductGallery.module.css";

type Props = {
  slides: string[];
  alt: string;
};

export function ProductGallery({ slides, alt }: Props) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const total = slides.length;
  const hasMultiple = total > 1;

  const goTo = (i: number) => setIndex(((i % total) + total) % total);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  useEffect(() => {
    if (!hasMultiple) return;
    const onKey = (e: KeyboardEvent) => {
      if (!trackRef.current?.contains(document.activeElement) && document.activeElement !== document.body) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, hasMultiple]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  };

  if (total === 0) return null;

  return (
    <div className={styles.wrap}>
      <div
        ref={trackRef}
        className={styles.imageCard}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role={hasMultiple ? "region" : undefined}
        aria-roledescription={hasMultiple ? "carousel" : undefined}
        aria-label={hasMultiple ? `Galería de ${alt}` : undefined}
      >
        {slides.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === 0 ? alt : `${alt} — imagen ${i + 1}`}
            width={1200}
            height={1200}
            priority={i === 0}
            className={clsx(styles.slideImg, i === index && styles.slideImgActive)}
            aria-hidden={i !== index}
          />
        ))}

        {hasMultiple && (
          <>
            <button
              type="button"
              className={clsx(styles.arrow, styles.arrowPrev)}
              onClick={prev}
              aria-label="Imagen anterior"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className={clsx(styles.arrow, styles.arrowNext)}
              onClick={next}
              aria-label="Imagen siguiente"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
            <div className={styles.counter}>
              {index + 1} / {total}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <ul className={styles.thumbs} role="tablist" aria-label="Miniaturas">
          {slides.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Ver imagen ${i + 1}`}
                onClick={() => goTo(i)}
                className={clsx(styles.thumbBtn, i === index && styles.thumbBtnActive)}
              >
                <Image src={src} alt="" width={160} height={160} className={styles.thumbImg} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
