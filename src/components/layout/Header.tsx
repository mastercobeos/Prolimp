"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./Header.module.css";
import { SearchBox } from "./SearchBox";

const navItems = [
  { href: "/sistemas-dilucion", label: "Sistemas de dilución" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/productos", label: "Productos", megamenu: true },
  { href: "/sucursales", label: "Sucursales" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

type NavItem = { slug: string; nombre: string };
type Props = { categorias: NavItem[]; lineas: NavItem[] };

export function Header({ categorias, lineas }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const diff = y - lastScrollY.current;
      if (y > 140 && diff > 10) setHidden(true);
      else if (diff < -8 || y < 80) setHidden(false);
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={clsx(styles.header, scrolled && styles.scrolled, hidden && !open && styles.hidden)}>
      <svg className={styles.svgFilter} aria-hidden focusable="false">
        <defs>
          <filter id="liquid-glass-distort" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div className={clsx("container-wide container", styles.inner)}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/img/logo/prolimp-logo.webp"
            alt="Prolimp"
            width={140}
            height={42}
            priority
          />
        </Link>

        <nav className={styles.nav} aria-label="Principal">
          <ul>
            {navItems.map((item) => (
              <li key={item.href} className={item.megamenu ? styles.hasMega : undefined}>
                <Link href={item.href}>{item.label}</Link>
                {item.megamenu && (
                  <div className={styles.mega}>
                    <div className={styles.megaGrid}>
                      <div>
                        <span className={styles.megaTitle}>Categorías</span>
                        <ul>
                          {categorias.map((c) => (
                            <li key={c.slug}>
                              <Link href={`/productos/${c.slug}`}>{c.nombre}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className={styles.megaTitle}>Limpiadores Prolimp®</span>
                        <ul>
                          {lineas.map((l) => (
                            <li key={l.slug}>
                              <Link href={`/productos/quimicos/${l.slug}`}>{l.nombre}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className={styles.megaTitle}>Productos por sector</span>
                        <ul>
                          <li><Link href="/hospitales">Hospitales y clínicas</Link></li>
                          <li><Link href="/industria-alimentaria">Industria alimentaria</Link></li>
                          <li><Link href="/industria-lactea">Industria láctea</Link></li>
                          <li><Link href="/plec">Línea PLEC · Ahorro</Link></li>
                          <li>
                            <a href="https://controldeolores-siba.com" target="_blank" rel="noopener noreferrer">
                              SIBA · Control de malos olores
                            </a>
                          </li>
                        </ul>
                        <span className={styles.megaTitle} style={{ marginTop: "1rem", display: "block" }}>Más</span>
                        <ul>
                          <li><Link href="/productos">Ver catálogo completo</Link></li>
                          <li><Link href="/sistemas-dilucion">Sistemas de Dilución</Link></li>
                          <li><Link href="/contacto">Solicitar cotización</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <SearchBox />

        <button
          className={clsx(styles.burger, open && styles.burgerOpen)}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={clsx(styles.mobile, open && styles.mobileOpen)}>
        <ul className={styles.mobileNav}>
          <li><Link href="/sistemas-dilucion" onClick={() => setOpen(false)}>Sistemas de dilución</Link></li>
          <li><Link href="/nosotros" onClick={() => setOpen(false)}>Nosotros</Link></li>
          <li className={styles.mobileGroup}>
            <details>
              <summary>Productos</summary>
              <div className={styles.mobileSub}>
                <span className={styles.mobileSubTitle}>Categorías</span>
                <ul>
                  <li><Link href="/productos" onClick={() => setOpen(false)}>Ver todo</Link></li>
                  {categorias.slice(0, 8).map((c) => (
                    <li key={c.slug}><Link href={`/productos/${c.slug}`} onClick={() => setOpen(false)}>{c.nombre}</Link></li>
                  ))}
                </ul>
                <span className={styles.mobileSubTitle}>Limpiadores Prolimp®</span>
                <ul>
                  {lineas.map((l) => (
                    <li key={l.slug}><Link href={`/productos/quimicos/${l.slug}`} onClick={() => setOpen(false)}>{l.nombre}</Link></li>
                  ))}
                </ul>
                <span className={styles.mobileSubTitle}>Productos por sector</span>
                <ul>
                  <li><Link href="/hospitales" onClick={() => setOpen(false)}>Hospitales y clínicas</Link></li>
                  <li><Link href="/industria-alimentaria" onClick={() => setOpen(false)}>Industria alimentaria</Link></li>
                  <li><Link href="/industria-lactea" onClick={() => setOpen(false)}>Industria láctea</Link></li>
                  <li><Link href="/plec" onClick={() => setOpen(false)}>Línea PLEC · Ahorro</Link></li>
                  <li>
                    <a href="https://controldeolores-siba.com" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                      SIBA · Control de malos olores
                    </a>
                  </li>
                  <li><Link href="/sistemas-dilucion" onClick={() => setOpen(false)}>Sistemas de Dilución</Link></li>
                </ul>
              </div>
            </details>
          </li>
          <li><Link href="/sucursales" onClick={() => setOpen(false)}>Sucursales</Link></li>
          <li><Link href="/blog" onClick={() => setOpen(false)}>Blog</Link></li>
          <li><Link href="/contacto" onClick={() => setOpen(false)}>Contacto</Link></li>
        </ul>
        <Link href="/contacto" className={styles.mobileCta} onClick={() => setOpen(false)}>
          Cotizar ahora
        </Link>
      </div>
    </header>
  );
}
