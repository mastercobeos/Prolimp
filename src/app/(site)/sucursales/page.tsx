import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { CtaBand } from "@/components/shared/CtaBand";
import { getEmpresa, getSucursales, type SucursalItem } from "@/lib/data";
import { DistribuidorForm } from "./DistribuidorForm";

export const metadata: Metadata = {
  title: "Sucursales y distribuidores",
  description:
    "Encuentra tu sucursal Prolimp más cercana: presencia de bodega y/o Tienda Prolimp en Veracruz, CDMX, Guanajuato, Querétaro, Tabasco y Yucatán, más distribuidores autorizados.",
};

function normalizePhone(tel: string) {
  return tel.replace(/[^\d+]/g, "");
}

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ---------- Inline icons ---------- */

function IconPin({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconBodega() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 21V9l9-5 9 5v12" />
      <path d="M7 21v-8h10v8" />
      <path d="M7 17h10" />
      <path d="M21 21H3" />
    </svg>
  );
}

function IconMedalla() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9.5 13.8 7.5 22l4.5-2.7L16.5 22l-2-8.2" />
    </svg>
  );
}

function IconEquipo() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconCamion() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="1" y="4" width="14" height="12" rx="1" />
      <path d="M15 9h4l4 4v3h-8V9z" />
      <circle cx="5.5" cy="18.5" r="2" />
      <circle cx="18.5" cy="18.5" r="2" />
    </svg>
  );
}

function IconEtiqueta() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.59 13.41 12 22l-9-9V4a1 1 0 0 1 1-1h9l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}

function IconLibro() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function IconEscudo() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function IconPaquete() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

/* ---------- Static content (mockup lámina 4) ---------- */

const distribuidores = [
  {
    nombre: "Quimicosas",
    ubicacion: "Colima, Col.",
    telefono: "312 314 20 22",
    email: "quimicosasdecolima@gmail.com",
  },
  {
    nombre: "Hielo Seco",
    ubicacion: "Piedras Negras, Coahuila",
    telefono: "878 688 20 25",
    email: "erodriguez@hielosecoproveedoraindustrial.com",
  },
  {
    nombre: "Rich Trade and Services Group",
    ubicacion: "Naucalpan, Edo. de México",
    telefono: "5553 57 24 41",
    email: "ventas@richtrade.com.mx",
  },
];

type InfoCard = { titulo: string; texto: string; icon: ReactNode };

const requisitos: InfoCard[] = [
  {
    titulo: "Infraestructura operativa",
    texto: "Contar con bodega, oficina o instalaciones adecuadas para almacenar, administrar y distribuir productos.",
    icon: <IconBodega />,
  },
  {
    titulo: "Experiencia",
    texto: "Conocimiento en la comercialización de productos para industria, comercio, instituciones o empresas.",
    icon: <IconMedalla />,
  },
  {
    titulo: "Estructura comercial",
    texto: "Equipo de ventas o personal dedicado a la prospección, seguimiento y atención de clientes.",
    icon: <IconEquipo />,
  },
  {
    titulo: "Solvencia económica",
    texto: "Capacidad financiera para operar, abastecerse y dar continuidad al crecimiento de la zona.",
    icon: <IconCamion />,
  },
];

const beneficios: InfoCard[] = [
  {
    titulo: "Atractivos márgenes de utilidad",
    texto: "",
    icon: <IconEtiqueta />,
  },
  {
    titulo: "Asesoría técnica y comercial",
    texto: "",
    icon: <IconLibro />,
  },
  {
    titulo: "Amplia gama de Productos y Servicios",
    texto: "",
    icon: <IconPaquete />,
  },
  {
    titulo: "Soporte técnico",
    texto: "",
    icon: <IconEscudo />,
  },
];

/* ---------- Cards ---------- */

function SucursalCard({ s }: { s: SucursalItem }) {
  const telefonos = [s.telefono, s.telefonoAlt].filter(Boolean) as string[];
  const emails = [s.email, s.emailAlt].filter(Boolean) as string[];
  const mapsUrl = s.direccion
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Prolimp ${s.ciudad} ${s.direccion}`)}`
    : null;

  return (
    <article className={styles.card}>
      <header className={styles.cardHead}>
        <div className={styles.pin}>
          <IconPin />
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
              <IconPin size={16} />
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
              <IconPhone />
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
              <IconMail />
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
              <IconClock />
            </span>
            <span className={styles.horario}>{s.horario}</span>
          </li>
        )}
      </ul>

      {mapsUrl && (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.mapsBtn}>
          Ver en Google Maps
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </article>
  );
}

/* ---------- Page ---------- */

export default async function SucursalesPage() {
  const [items, empresa] = await Promise.all([getSucursales(), getEmpresa()]);
  const sucursales = items.filter((s) => (s.tipo ?? "sucursal") === "sucursal");
  const tiendas = items.filter((s) => s.tipo === "tienda");
  const coberturas = items.filter((s) => s.tipo === "cobertura");

  // Group sucursales y tiendas por estado (mostramos ambas)
  const grupos = sucursales.reduce<Record<string, SucursalItem[]>>((acc, s) => {
    (acc[s.estado] ??= []).push(s);
    return acc;
  }, {});
  const gruposTiendas = tiendas.reduce<Record<string, SucursalItem[]>>((acc, t) => {
    (acc[t.estado] ??= []).push(t);
    return acc;
  }, {});
  const ordenEstados = ["Veracruz", "Guanajuato", "Tabasco", "Querétaro", "CDMX", "Yucatán"];
  const estadosSet = new Set([...Object.keys(grupos), ...Object.keys(gruposTiendas)]);
  const estados = [...estadosSet].sort((a, b) => {
    const ia = ordenEstados.indexOf(a);
    const ib = ordenEstados.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return (
    <>
      {/* 1. Hero */}
      <section className={styles.hero}>
        <div className="container container-wide">
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <span className={styles.eyebrow}>Sucursales</span>
              <h1>
                Encuentra tu sucursal <span className={styles.acento}>más cercana</span>
              </h1>
              <p>
                Conoce todos los estados de la república en donde tenemos presencia de bodega y/o
                Tienda Prolimp.
              </p>
              <nav className={styles.estadoPills} aria-label="Estados con sucursal Prolimp">
                {estados.map((estado) => (
                  <a key={estado} href={`#estado-${slugify(estado)}`} className={styles.pillLink}>
                    {estado}
                  </a>
                ))}
              </nav>
              <div className={styles.heroFoto}>
                <Image
                  src="/img/redesign/sucursales-hero.webp"
                  alt="Personal de Prolimp cargando cajas en el camión de reparto"
                  width={1200}
                  height={1106}
                  priority
                />
              </div>
            </div>

            <aside className={styles.heroCard} aria-label="Resumen de presencia Prolimp">
              <div className={styles.heroCardHead}>
                <span className={styles.heroCardPin} aria-hidden>
                  <IconPin size={26} />
                </span>
                <div>
                  <strong>{sucursales.length} sucursales y {tiendas.length} tiendas</strong>
                </div>
              </div>
              <ul className={styles.heroCardList}>
                {estados.map((estado) => {
                  const total = (grupos[estado]?.length ?? 0) + (gruposTiendas[estado]?.length ?? 0);
                  return (
                    <li key={estado}>
                      <span>{estado}</span>
                      <span className={styles.heroCardCount}>{total}</span>
                    </li>
                  );
                })}
              </ul>
              {coberturas.length > 0 && (
                <p className={styles.heroCardNota}>
                  Cobertura por rutas de entrega:{" "}
                  {coberturas.map((c, i) => (
                    <span key={c._id}>
                      {i > 0 ? ", " : ""}
                      {c.ciudad}
                    </span>
                  ))}
                  .
                </p>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* 1b. Detalle de sucursales por estado (destino de las pills) */}
      <section className={`section ${styles.listado}`}>
        <div className="container container-wide">
          {estados.map((estado) => {
            const sucs = grupos[estado] ?? [];
            const tds = gruposTiendas[estado] ?? [];
            const partes = [];
            if (sucs.length) partes.push(`${sucs.length} sucursal${sucs.length > 1 ? "es" : ""}`);
            if (tds.length) partes.push(`${tds.length} tienda${tds.length > 1 ? "s" : ""}`);
            return (
              <section key={estado} id={`estado-${slugify(estado)}`} className={styles.estadoBlock}>
                <h2 className={styles.estadoTitle}>
                  <span className={styles.estadoBar} aria-hidden />
                  {estado}
                  <span className={styles.estadoCount}>{partes.join(" · ")}</span>
                </h2>
                {sucs.length > 0 && (
                  <div className={styles.grid}>
                    {sucs.map((s) => (
                      <SucursalCard key={s._id} s={s} />
                    ))}
                  </div>
                )}
                {tds.length > 0 && (
                  <>
                    <h3 className={styles.subgrupoTitle}>
                      Tienda{tds.length > 1 ? "s" : ""} Prolimp
                    </h3>
                    <div className={styles.grid}>
                      {tds.map((t) => (
                        <SucursalCard key={t._id} s={t} />
                      ))}
                    </div>
                  </>
                )}
              </section>
            );
          })}
        </div>
      </section>

      {/* 2. Banda CTA envíos */}
      <CtaBand
        titulo="¿No encontraste sucursal en tu ciudad?"
        lede="Hacemos envío a todo el país y atendemos clientes con servicio logístico a nivel nacional."
        cta="Contáctanos"
        href="/contacto"
        variant="marino"
      />

      {/* 2b. Mercado Libre */}
      <section className={`section ${styles.mlSection}`}>
        <div className="container">
          <h2>También encuentra nuestros productos en:</h2>
          <div className={styles.mlRow}>
            <Image
              src="/img/redesign/mercadolibre-logo.png"
              alt="Mercado Libre"
              width={268}
              height={68}
              className={styles.mlLogo}
            />
            <a
              href="https://www.mercadolibre.com.mx/pagina/prolimp_2194"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mlBtn}
            >
              Ir a tienda
            </a>
          </div>
        </div>
      </section>

      {/* 3. Distribuidores */}
      <section className={`section ${styles.distSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>Distribuidores</span>
            <h2>Red de distribuidores Prolimp</h2>
            <p>
              Acercamos nuestros productos de limpieza profesional a más empresas a través de
              aliados comerciales en diferentes zonas.
            </p>
          </div>
          <div className={styles.distLayout}>
            <div className={styles.distFoto}>
              <Image
                src="/img/redesign/distribuidor-retrato.webp"
                alt="Repartidor Prolimp al volante de su camioneta"
                width={1200}
                height={1402}
              />
            </div>
            <ul className={styles.distGrid}>
              {distribuidores.map((d) => (
              <li key={d.nombre} className={styles.distCard}>
                <h3>{d.nombre}</h3>
                <p className={styles.distLoc}>{d.ubicacion}</p>
                <ul className={styles.details}>
                  <li>
                    <span className={styles.icon} aria-hidden>
                      <IconPhone />
                    </span>
                    <a href={`tel:${normalizePhone(d.telefono)}`}>Tel. {d.telefono}</a>
                  </li>
                  <li>
                    <span className={styles.icon} aria-hidden>
                      <IconMail />
                    </span>
                    <a href={`mailto:${d.email}`}>{d.email}</a>
                  </li>
                </ul>
              </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Banda buscamos distribuidores */}
      <section className={styles.banda}>
        <div className="container">
          <h2>Buscamos distribuidores</h2>
          <p>
            En Prolimp buscamos aliados comerciales con la capacidad operativa, comercial y
            financiera para representar y distribuir nuestros productos en nuevas zonas.
          </p>
        </div>
      </section>

      {/* 5. Requisitos */}
      <section className={`section ${styles.reqSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2>Perfil que buscamos</h2>
          </div>
          <ul className={styles.infoGrid}>
            {requisitos.map((r) => (
              <li key={r.titulo} className={styles.infoCard}>
                <span className={styles.infoIcon} aria-hidden>
                  {r.icon}
                </span>
                <h3>{r.titulo}</h3>
                <p>{r.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Lo que te podemos ofrecer */}
      <section className={`section ${styles.ofrecerSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2>
              Lo que te podemos <span className={styles.acento}>ofrecerte</span>
            </h2>
          </div>
          <ul className={styles.infoGrid}>
            {beneficios.map((b) => (
              <li key={b.titulo} className={styles.infoCard}>
                <span className={styles.infoIcon} aria-hidden>
                  {b.icon}
                </span>
                <h3>{b.titulo}</h3>
                {b.texto && <p>{b.texto}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Formulario de solicitud de distribución (lámina 4) */}
      <section className={styles.formSection}>
        <div className="container">
          <h2>
            ¿Quieres emprender un negocio o tienes experiencia en distribución de productos?
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formFoto}>
              <Image
                src="/img/redesign/distribuidor-form.webp"
                alt="Repartidor cargando cajas Prolimp en una camioneta"
                width={1200}
                height={1681}
              />
            </div>
            <DistribuidorForm whatsapp={empresa.whatsapp} />
          </div>
        </div>
      </section>
    </>
  );
}
