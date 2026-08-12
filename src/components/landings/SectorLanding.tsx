import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { urlForImage } from "@/sanity/image";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";
import { splitNombreProducto } from "@/lib/productName";
import { CtaBand } from "@/components/shared/CtaBand";
import styles from "./SectorLanding.module.css";

export type SectorLandingProps = {
  eyebrow: string;
  /** Palabra inicial resaltada en el color del tema (en PLEC va "PLEC" en rojo). */
  tituloPrefijo?: string;
  titulo: string;
  tituloAcento?: string;
  lede: string;
  heroImage?: string;
  /** Proporción del marco del hero. 4/5 por defecto; PLEC usa una foto cuadrada
   *  que a 4/5 se recortaría por los lados. */
  heroAspecto?: string;
  beneficios: { icon: string; titulo: string; descripcion: string }[];
  eyebrowSeccion?: string;
  beneficiosTitulo?: string;
  productosLineaSlug?: string;
  productosCategoriaSlug?: string;
  productosSlugs?: string[];
  productosTitulo?: string;
  /** Destino del "Ver más" que el mockup pone junto al título de productos. */
  verMasHref?: string;
  productosLimit?: number;
  sellos?: boolean;
  bandaPlec?: boolean;
  tema?: "azul" | "rojo";
  ctaTitulo?: string;
  ctaLede?: string;
  ctaLabel?: string;
  gradienteHero?: string;
};

type Producto = {
  _id: string;
  nombre: string;
  slug: string;
  descripcionCorta?: string;
  imagenPrincipal?: unknown;
  marca?: string;
};

const productosPorLineaQuery = groq`
  *[_type == "producto" && activo == true && linea->slug.current == $slug && defined(imagenPrincipal)]
   | order(nombre asc) [0...$limit] {
    _id, nombre, "slug": slug.current, descripcionCorta,
    "imagenPrincipal": imagenPrincipal{ _type, asset, alt, hotspot, crop },
    "marca": marca->nombre
  }
`;

const productosPorCategoriaQuery = groq`
  *[_type == "producto" && activo == true && categoria->slug.current == $slug && defined(imagenPrincipal)]
   | order(nombre asc) [0...$limit] {
    _id, nombre, "slug": slug.current, descripcionCorta,
    "imagenPrincipal": imagenPrincipal{ _type, asset, alt, hotspot, crop },
    "marca": marca->nombre
  }
`;

const productosPorSlugsQuery = groq`
  *[_type == "producto" && activo == true && slug.current in $slugs] {
    _id, nombre, "slug": slug.current, descripcionCorta,
    "imagenPrincipal": imagenPrincipal{ _type, asset, alt, hotspot, crop },
    "marca": marca->nombre
  }
`;

const SELLOS = [
  { src: "/img/redesign/sello-nsf.webp", alt: "NSF International" },
  { src: "/img/redesign/sello-desinfeccion.webp", alt: "Desinfección garantizada Prolimp" },
  { src: "/img/redesign/sello-kosher.webp", alt: "Certificación Kosher KMD" },
  { src: "/img/redesign/sello-virus.webp", alt: "Eficaz contra virus" },
];

/* Iconografía outline (una sola familia, color por tema) — lámina 8-11 */
const ICONS: Record<string, React.ReactNode> = {
  desinfeccion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="11" r="3" />
      <path d="M12 6.5v1.5M12 14v1.5M7.5 11H9M15 11h1.5" />
    </svg>
  ),
  camilla: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 5v9h18v-4a3 3 0 0 0-3-3h-8" />
      <path d="M3 14v3M21 14v3" />
      <circle cx="7" cy="19" r="1.6" />
      <circle cx="17" cy="19" r="1.6" />
      <path d="M6 8h3" />
    </svg>
  ),
  documentos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  ),
  botella: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 3h6M10 3v3l-2.5 3A4 4 0 0 0 7 11.4V19a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-7.6a4 4 0 0 0-.5-2.4L14 6V3" />
      <path d="M8.5 14h7" />
    </svg>
  ),
  medalla: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9.5 13.8 7.5 22l4.5-2.7L16.5 22l-2-8.2" />
    </svg>
  ),
  norma: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 3h9l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  cip: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 8a3 3 0 0 1 6 0v10H4zM14 8a3 3 0 0 1 6 0v10h-6z" />
      <path d="M4 13h6M14 13h6M10 10h4" />
    </svg>
  ),
  sectores: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16.5 6.5c3 0 5 1.8 5 4s-2.2 4-5 4c-1 2.2-3.4 3.5-6.5 3.5-4 0-7-2.5-7-6s3-6 7-6c2.7 0 5.2.2 6.5.5z" />
      <circle cx="16" cy="11" r="1" />
    </svg>
  ),
  grasa: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3s5 5.5 5 9a5 5 0 0 1-10 0c0-3.5 5-9 5-9z" />
      <path d="M19.5 15.5s1.5 1.8 1.5 3a1.8 1.8 0 0 1-3.6 0c0-1.2 2.1-3 2.1-3z" />
    </svg>
  ),
  sarro: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  ),
  precio: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="9" r="6" />
      <path d="M12 6v6M10 7.5h3a1.5 1.5 0 0 1 0 3h-2a1.5 1.5 0 0 0 0 3h3" />
      <path d="M5 17c1.5 2 4 3.5 7 3.5s5.5-1.5 7-3.5" />
    </svg>
  ),
  presentaciones: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 8h4v13H5zM10.5 5h4v16h-4zM16 10h4v11h-4z" />
      <path d="M6 3h2" />
    </svg>
  ),
  multisector: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 21V9l6-4v16M9 21V9l6 4v8M15 21v-6l6-3v9" />
      <path d="M3 21h18" />
    </svg>
  ),
  desempeno: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6 6 0 0 0 12 3z" />
      <path d="M12 7v3" />
    </svg>
  ),
};

function BenefitIcon({ name }: { name: string }) {
  const icon = ICONS[name];
  if (icon) return <span className={styles.benefitSvg}>{icon}</span>;
  return <>{name}</>;
}

export async function SectorLanding(props: SectorLandingProps) {
  let productos: Producto[] = [];
  if (props.productosSlugs?.length) {
    const fetched = await client.fetch<Producto[]>(productosPorSlugsQuery, { slugs: props.productosSlugs });
    const orden = props.productosSlugs;
    productos = [...(fetched ?? [])].sort((a, b) => orden.indexOf(a.slug) - orden.indexOf(b.slug));
  } else if (props.productosLineaSlug) {
    productos = await client.fetch(productosPorLineaQuery, {
      slug: props.productosLineaSlug,
      limit: props.productosLimit ?? 8,
    });
  } else if (props.productosCategoriaSlug) {
    productos = await client.fetch(productosPorCategoriaQuery, {
      slug: props.productosCategoriaSlug,
      limit: props.productosLimit ?? 8,
    });
  }

  const gradient = props.gradienteHero ?? "linear-gradient(135deg, rgba(0,174,239,0.12), rgba(2,116,197,0.18) 60%, rgba(12,31,110,0.15))";
  const beneficiosTitulo = props.beneficiosTitulo ?? `Fórmulas diseñadas para ${props.eyebrow.toLowerCase()}`;

  return (
    <main className={clsx(styles.page, props.tema === "rojo" && styles.temaRojo)}>
      <section className={styles.hero} style={{ background: gradient }}>
        <div className="container container-wide">
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}>{props.eyebrow}</span>
              <h1 className={styles.title}>
                {props.tituloPrefijo && <><span className={styles.accent}>{props.tituloPrefijo}</span> </>}
                {props.titulo}
                {props.tituloAcento && <> <span className={styles.accent}>{props.tituloAcento}</span></>}
              </h1>
              <p className={styles.lede}>{props.lede}</p>
              <div className={styles.actions}>
                <Link href="/contacto" className={styles.btnGhost}>Solicitar cotización</Link>
                <Link href="/descarga-catalogo" className={styles.btnPrimary}>
                  Descarga Catálogo
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            {props.heroImage && (
              <div className={styles.heroImage} style={{ aspectRatio: props.heroAspecto ?? "4 / 5" }}>
                <Image src={props.heroImage} alt={props.titulo} width={640} height={720} priority />
              </div>
            )}
          </div>
        </div>
      </section>

      {props.sellos && (
        <section className={styles.sellosBand} aria-label="Certificaciones">
          <div className="container container-wide">
            <ul className={styles.sellosRow}>
              {SELLOS.map((s) => (
                <li key={s.alt}>
                  <Image src={s.src} alt={s.alt} width={520} height={360} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {props.bandaPlec && (
        <Link href="/productos/quimicos/plec" className={styles.plecBand}>
          <span className={styles.plecLogo} aria-label="PLEC Plus">PLEC<span className={styles.plecPlus}>+</span></span>
          <em className={styles.plecTagline}>Ahorro real para tu negocio</em>
          <span className={styles.plecAction}>
            Ver más
            <span className={styles.plecCircle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </span>
        </Link>
      )}

      <section className={`section ${styles.beneficiosSection}`}>
        <div className="container container-wide">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrowSm}>{props.eyebrowSeccion ?? "Por qué Prolimp"}</span>
            <h2>{beneficiosTitulo}</h2>
          </div>
          <ul className={styles.beneficiosGrid}>
            {props.beneficios.map((b, i) => (
              <li key={i} className={styles.benefitCard}>
                <div className={styles.benefitIcon} aria-hidden><BenefitIcon name={b.icon} /></div>
                <h3>{b.titulo}</h3>
                <p>{b.descripcion}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {productos.length > 0 && (
        <section className={`section ${styles.productosSection}`}>
          <div className="container container-wide">
            <div className={clsx(styles.sectionHead, styles.sectionHeadRow)}>
              <div>
                <span className={styles.eyebrowSm}>Productos recomendados</span>
                <h2>{props.productosTitulo ?? "Algunos productos ideales para este sector"}</h2>
              </div>
              <Link href={props.verMasHref ?? "/productos/quimicos"} className={styles.verMas}>
                Ver más
                <span className={styles.verMasCirculo}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </div>
            <ul className={styles.productGrid}>
              {productos.map((p) => {
                const src = p.imagenPrincipal ? urlForImage(p.imagenPrincipal).width(400).auto("format").url() : null;
                const { titulo, subtitulo } = splitNombreProducto(p.nombre);
                return (
                  <li key={p._id}>
                    <Link href={`/producto/${p.slug}`} className={styles.productCard}>
                      <div className={styles.productImg}>
                        {src ? <Image src={src} alt={p.nombre} width={300} height={300} /> : <div />}
                      </div>
                      <div className={styles.productBody}>
                        <h3>{titulo}</h3>
                        {subtitulo && <span className={styles.productSubtitulo}>{subtitulo}</span>}
                        {p.descripcionCorta && <p>{p.descripcionCorta}</p>}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <CtaBand
        variant="marino"
        titulo={props.ctaTitulo ?? "¿Necesitas asesoría para tu operación?"}
        lede={props.ctaLede ?? "Nuestro equipo técnico te ayuda a diseñar el protocolo de limpieza correcto y a elegir los químicos adecuados."}
        cta={props.ctaLabel ?? "Contactar un asesor"}
        href="/contacto"
      />
    </main>
  );
}
