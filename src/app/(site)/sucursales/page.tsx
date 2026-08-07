import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import { getSucursales, type SucursalItem } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sucursales y distribuidores",
  description:
    "12 sucursales propias en Veracruz, CDMX, Guanajuato, Querétaro, Tabasco y Yucatán, más distribuidores autorizados en Colima, Coahuila y Estado de México. Encuentra tu Prolimp más cercano.",
};

function normalizePhone(tel: string) {
  return tel.replace(/[^\d+]/g, "");
}

function SucursalCard({ s }: { s: SucursalItem }) {
  const telefonos = [s.telefono, s.telefonoAlt].filter(Boolean) as string[];
  const emails = [s.email, s.emailAlt].filter(Boolean) as string[];
  const mapsUrl = s.direccion
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Prolimp ${s.ciudad} ${s.direccion}`)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Prolimp ${s.ciudad}`)}`;

  return (
    <article className={styles.card}>
      <header className={styles.cardHead}>
        <div className={styles.pin}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          <h3>{s.ciudad}</h3>
          <span className={styles.estado}>{s.estado}</span>
        </div>
      </header>

      <ul className={styles.details}>
        {s.direccion && (
          <li>
            <span className={styles.icon} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <span>
              {s.direccion}
              {s.codigoPostal && <>, CP {s.codigoPostal}</>}
            </span>
          </li>
        )}
        {telefonos.length > 0 && (
          <li>
            <span className={styles.icon} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <span>
              {telefonos.map((t, i) => (
                <span key={t}>
                  <a href={`tel:${normalizePhone(t)}`}>{t}</a>
                  {i < telefonos.length - 1 && <>{" · "}</>}
                </span>
              ))}
            </span>
          </li>
        )}
        {emails.length > 0 && (
          <li>
            <span className={styles.icon} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <span className={styles.emails}>
              {emails.map((e) => (
                <a key={e} href={`mailto:${e}`}>{e}</a>
              ))}
            </span>
          </li>
        )}
        {s.horario && (
          <li>
            <span className={styles.icon} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <span className={styles.horario}>{s.horario}</span>
          </li>
        )}
      </ul>

      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.mapsBtn}>
        Ver en Google Maps
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </a>
    </article>
  );
}

function DistribuidorCard({ s }: { s: SucursalItem }) {
  return (
    <article className={styles.distCard}>
      <div className={styles.distBadge}>Distribuidor autorizado</div>
      <h3>{s.nombre ?? s.ciudad}</h3>
      <p className={styles.distLoc}>{s.ciudad}, {s.estado}</p>
      <ul className={styles.details}>
        {s.telefono && (
          <li>
            <span className={styles.icon} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <a href={`tel:${normalizePhone(s.telefono)}`}>{s.telefono}</a>
          </li>
        )}
        {s.email && (
          <li>
            <span className={styles.icon} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <a href={`mailto:${s.email}`}>{s.email}</a>
          </li>
        )}
      </ul>
    </article>
  );
}

export default async function SucursalesPage() {
  const items = await getSucursales();
  const sucursales = items.filter((s) => (s.tipo ?? "sucursal") === "sucursal");
  const distribuidores = items.filter((s) => s.tipo === "distribuidor");

  // Group sucursales by estado
  const grupos = sucursales.reduce<Record<string, SucursalItem[]>>((acc, s) => {
    (acc[s.estado] ??= []).push(s);
    return acc;
  }, {});
  const ordenEstados = ["Veracruz", "CDMX", "Guanajuato", "Querétaro", "Tabasco", "Yucatán"];
  const estados = Object.keys(grupos).sort((a, b) => {
    const ia = ordenEstados.indexOf(a);
    const ib = ordenEstados.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return (
    <section className={styles.section}>
      <div className="container container-wide">
        <header className={styles.head}>
          <span className={styles.eyebrow}>Cobertura nacional</span>
          <h1>Sucursales y distribuidores</h1>
          <p>
            {sucursales.length} sucursales propias en {estados.length} estados y {distribuidores.length} distribuidores autorizados.
            Encuentra la más cercana o contáctanos para envío a cualquier punto de México.
          </p>
          <div className={styles.stats}>
            <div><strong>{sucursales.length}</strong><span>Sucursales propias</span></div>
            <div><strong>{estados.length}</strong><span>Estados</span></div>
            <div><strong>{distribuidores.length}</strong><span>Distribuidores</span></div>
            <div><strong>32</strong><span>Estados con envío</span></div>
          </div>
        </header>

        {estados.map((estado) => (
          <details key={estado} className={styles.estadoBlock}>
            <summary className={styles.estadoTitle}>
              <span className={styles.estadoBar} aria-hidden />
              <span className={styles.chevron} aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
              {estado}
              <span className={styles.estadoCount}>{grupos[estado].length} sucursal{grupos[estado].length > 1 ? "es" : ""}</span>
            </summary>
            <div className={styles.grid}>
              {grupos[estado].map((s) => (
                <SucursalCard key={s._id} s={s} />
              ))}
            </div>
          </details>
        ))}

        {distribuidores.length > 0 && (
          <div className={styles.distSection}>
            <h2 className={styles.estadoTitle}>
              <span className={styles.estadoBar} aria-hidden />
              Distribuidores autorizados
              <span className={styles.estadoCount}>{distribuidores.length} aliados</span>
            </h2>
            <p className={styles.distIntro}>
              Puntos de venta oficiales fuera de nuestras zonas con sucursal propia. Trabajan directamente con productos Prolimp.
            </p>
            <div className={styles.distGrid}>
              {distribuidores.map((s) => (
                <DistribuidorCard key={s._id} s={s} />
              ))}
            </div>
          </div>
        )}

        <div className={styles.cta}>
          <div>
            <h2>¿No encuentras tu ciudad?</h2>
            <p>Enviamos productos a todo México. Contáctanos para tu cotización personalizada o para conocer el programa de distribuidores.</p>
          </div>
          <div className={styles.ctaActions}>
            <Link href="/contacto" className={styles.btnPrimary}>Formulario de contacto</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
