import Image from "next/image";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { CtaBand } from "@/components/shared/CtaBand";
import { CtaCierre } from "@/components/home/CtaCierre";
import { Diferenciadores } from "@/components/home/Diferenciadores";
import { getEmpresa, getHomeContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Fabricantes mexicanos de químicos y productos de limpieza profesional desde 1971. Certificación ISO 9001, registros sanitarios y capacitación STPS.",
};

const confianza = [
  {
    titulo: "Certificación ISO 9001",
    descripcion: "Sistema de gestión de calidad certificado.",
    imgs: [{ src: "/img/redesign/sello-iso-9001.png", alt: "Sello ISO 9001-2015", width: 149, height: 107 }],
  },
  {
    titulo: "Empresa ESR",
    descripcion: "Compromiso reconocido con la responsabilidad social empresarial.",
    imgs: [{ src: "/img/redesign/sello-esr.png", alt: "Distintivo Empresa Socialmente Responsable", width: 200, height: 79 }],
  },
  {
    titulo: "Registros Sanitarios",
    descripcion: "Productos regulados ante la Secretaría de Salud.",
    imgs: [
      { src: "/img/redesign/sello-salud.png", alt: "Secretaría de Salud", width: 149, height: 48 },
      { src: "/img/redesign/sello-cofepris.png", alt: "COFEPRIS", width: 150, height: 75 },
    ],
  },
  {
    titulo: "Miembros ISSA",
    descripcion: "Parte de la asociación mundial de la industria de la limpieza.",
    imgs: [{ src: "/img/redesign/sello-issa.png", alt: "ISSA", width: 148, height: 65 }],
  },
];

const marcas = [
  { src: "/img/redesign/marca-wiese.webp", alt: "Wiese", width: 600, height: 436 },
  { src: "/img/redesign/marca-kimberly.webp", alt: "Kimberly-Clark Professional", width: 600, height: 230 },
  { src: "/img/redesign/marca-castor.webp", alt: "El Castor", width: 600, height: 456 },
  { src: "/img/redesign/marca-rubbermaid.webp", alt: "Rubbermaid", width: 600, height: 178 },
  { src: "/img/redesign/marca-scf.webp", alt: "SCF", width: 600, height: 324 },
  { src: "/img/redesign/marca-jvd.webp", alt: "JVD", width: 600, height: 379 },
  { src: "/img/redesign/marca-cuplasa.webp", alt: "Cuplasa", width: 600, height: 340 },
  { src: "/img/redesign/marca-libra.webp", alt: "Libra", width: 600, height: 600 },
  { src: "/img/redesign/marca-sanchez.webp", alt: "Sánchez y Martín", width: 600, height: 173 },
  { src: "/img/redesign/marca-corona.webp", alt: "La Corona", width: 600, height: 443 },
  { src: "/img/redesign/marca-rml.webp", alt: "RML", width: 600, height: 600 },
];

const materiales = ["Manual de Procesos", "Fichas Técnicas", "Hojas de Seguridad", "Ayudas Visuales", "Constancia DC3"];

function DocIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

export default async function NosotrosPage() {
  const [empresa, home] = await Promise.all([getEmpresa(), getHomeContent()]);
  return (
    <>
      {/* 1. Hero */}
      <section className={styles.hero}>
        <div className="container container-wide">
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <span className={styles.eyebrow}>Nosotros</span>
              <h1>
                Somos fabricantes <span className={styles.acento}>de limpiadores y desinfectantes</span>
              </h1>
              <p>{empresa.descripcion}</p>
              <div className={styles.stats}>
                <div>
                  <strong>11</strong>
                  <span>Líneas de limpiadores propios</span>
                </div>
                <div>
                  <strong>+35</strong>
                  <span>Años de experiencia</span>
                </div>
                <div>
                  <strong>ISO</strong>
                  <span>9001 certificados</span>
                </div>
              </div>
            </div>
            <div className={styles.heroCard}>
              <Image
                src="/img/redesign/familia-productos.png"
                alt="Familia de productos Prolimp"
                width={800}
                height={800}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Tarjetas de confianza */}
      <section className={`section ${styles.confianzaSection}`}>
        <div className="container">
          <ul className={styles.confianzaGrid}>
            {confianza.map((c) => (
              <li key={c.titulo} className={styles.confianzaCard}>
                <div className={styles.confianzaImgs}>
                  {c.imgs.map((img) => (
                    <Image key={img.src} src={img.src} alt={img.alt} width={img.width} height={img.height} />
                  ))}
                </div>
                <h2>{c.titulo}</h2>
                <p>{c.descripcion}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Nuestra Fórmula (compartida con home) */}
      <Diferenciadores items={home.diferenciadores} />

      {/* 4. Banda CTA */}
      <CtaBand
        titulo="Pero más allá de todo esto…"
        lede="Estamos seguros de la eficacia de nuestros productos, testados constantemente en el campo."
        href="/productos"
        cta="Ver más"
        variant="marino"
      />

      {/* 5. Portafolio completo — muro de marcas */}
      <section className={`section ${styles.portafolioSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>Portafolio completo</span>
            <h2>Distribuidores de marcas reconocidas</h2>
            <p>
              Además, proveemos todas las herramientas necesarias para llevar a cabo todos los
              procesos de limpieza.
            </p>
          </div>
          <ul className={styles.marcasCard}>
            {marcas.map((m) => (
              <li key={m.alt}>
                <Image src={m.src} alt={m.alt} width={m.width} height={m.height} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Capacitación */}
      <section className={`section ${styles.capacitacionSection}`}>
        <div className="container container-wide">
          <div className={styles.capGrid}>
            <div className={styles.capContent}>
              <span className={styles.eyebrow}>Capacitación</span>
              <h2>Fortalecemos el oficio de la limpieza</h2>
              <p className={styles.capSubtitulo}>
                Entregamos constancia DC3 válida ante cualquier auditoría de la STPS
              </p>
              <p>
                Capacitamos al personal y trabajadores con nuestro curso <em>Manejo y uso seguro de
                productos de limpieza y desinfección</em>, registrado ante la STPS con folio
                <strong> PCE-910401-4L7-0013</strong> que nos acredita como agentes capacitadores
                externos.
              </p>
              <h3 className={styles.capBrindamos}>Brindamos a nuestros clientes:</h3>
              <ul className={styles.materiales}>
                {materiales.map((m) => (
                  <li key={m}>
                    <span className={styles.docIcon}>
                      <DocIcon />
                    </span>
                    <strong>{m}</strong>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.capFotos}>
              <div className={styles.capFoto}>
                <Image
                  src="/img/redesign/capacitacion-sala.jpg"
                  alt="Sala de capacitación con personal de limpieza"
                  width={799}
                  height={529}
                />
              </div>
              <div className={styles.capFoto}>
                <Image
                  src="/img/redesign/capacitacion-dosificador.png"
                  alt="Técnica operando un dosificador de limpiadores"
                  width={799}
                  height={574}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA final */}
      <CtaCierre titulo="¿Listo para mejorar el estándar de limpieza de tu empresa?" />
    </>
  );
}
