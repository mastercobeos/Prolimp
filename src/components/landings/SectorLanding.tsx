import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/image";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";
import styles from "./SectorLanding.module.css";

export type SectorLandingProps = {
  eyebrow: string;
  titulo: string;
  tituloAcento?: string;
  lede: string;
  heroImage?: string;
  beneficios: { icon: string; titulo: string; descripcion: string }[];
  productosLineaSlug?: string;
  productosCategoriaSlug?: string;
  productosLimit?: number;
  ctaLede?: string;
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

export async function SectorLanding(props: SectorLandingProps) {
  let productos: Producto[] = [];
  if (props.productosLineaSlug) {
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

  return (
    <main className={styles.page}>
      <section className={styles.hero} style={{ background: gradient }}>
        <div className="container container-wide">
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}>{props.eyebrow}</span>
              <h1 className={styles.title}>
                {props.titulo}
                {props.tituloAcento && <> <span className={styles.accent}>{props.tituloAcento}</span></>}
              </h1>
              <p className={styles.lede}>{props.lede}</p>
              <div className={styles.actions}>
                <Link href="/contacto" className={styles.btnPrimary}>Solicitar cotización</Link>
                <Link href="/descarga-catalogo" className={styles.btnGhost}>Descargar catálogo</Link>
              </div>
            </div>
            {props.heroImage && (
              <div className={styles.heroImage}>
                <Image src={props.heroImage} alt={props.titulo} width={640} height={720} priority />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={`section ${styles.beneficiosSection}`}>
        <div className="container container-wide">
          <div className={styles.beneficiosHead}>
            <span className={styles.eyebrowSm}>Por qué Prolimp</span>
            <h2>Fórmulas diseñadas para {props.eyebrow.toLowerCase()}</h2>
          </div>
          <ul className={styles.beneficiosGrid}>
            {props.beneficios.map((b, i) => (
              <li key={i} className={styles.benefitCard}>
                <div className={styles.benefitIcon} aria-hidden>{b.icon}</div>
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
            <div className={styles.beneficiosHead}>
              <span className={styles.eyebrowSm}>Productos recomendados</span>
              <h2>{productos.length} productos ideales para tu sector</h2>
            </div>
            <ul className={styles.productGrid}>
              {productos.map((p) => {
                const src = p.imagenPrincipal ? urlForImage(p.imagenPrincipal).width(400).auto("format").url() : null;
                return (
                  <li key={p._id}>
                    <Link href={`/producto/${p.slug}`} className={styles.productCard}>
                      <div className={styles.productImg}>
                        {src ? <Image src={src} alt={p.nombre} width={300} height={300} /> : <div />}
                      </div>
                      <div className={styles.productBody}>
                        {p.marca && <span className={styles.productMarca}>{p.marca}</span>}
                        <h3>{p.nombre}</h3>
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

      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2>¿Necesitas asesoría para tu operación?</h2>
            <p>{props.ctaLede ?? "Nuestro equipo técnico te ayuda a diseñar el protocolo de limpieza correcto y a elegir los químicos adecuados."}</p>
            <div className={styles.ctaActions}>
              <Link href="/contacto" className={styles.btnPrimary}>Contactar un asesor</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
