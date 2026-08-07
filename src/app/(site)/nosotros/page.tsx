import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { CtaCierre } from "@/components/home/CtaCierre";
import { getEmpresa, getHomeContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Fabricantes mexicanos de químicos y productos de limpieza profesional desde 1971. Certificación ISO 9001, registros sanitarios y capacitación STPS.",
};

export default async function NosotrosPage() {
  const [empresa, home] = await Promise.all([getEmpresa(), getHomeContent()]);
  const diferenciadores = home.diferenciadores;
  return (
    <>
      <section className={styles.hero}>
        <div className="container container-wide">
          <div className={styles.heroInner}>
            <div>
              <span className={styles.eyebrow}>Acerca de nosotros</span>
              <h1>Somos fabricantes de limpiadores y desinfectantes</h1>
              <p>{empresa.descripcion}</p>
              <div className={styles.metrics}>
                <div><strong>50+</strong><span>Años de experiencia</span></div>
                <div><strong>11</strong><span>Líneas propias</span></div>
                <div><strong>ISO</strong><span>9001 certificados</span></div>
              </div>
            </div>
            <div className={styles.heroImg}>
              <Image src="/img/nosotros/banner-fabricantes.webp" alt="Fabricantes Prolimp" width={720} height={400} priority />
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.diferenciasSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrowSm}>Nuestra fórmula</span>
            <h2>Qué hace diferentes a nuestros químicos</h2>
            <p>
              Nuestros desinfectantes cuentan con retos microbianos y virucidas. Los limpiadores tienen
              registro NSF: pueden usarse en industria alimentaria garantizando alimentos inocuos, libres
              de contaminación química.
            </p>
          </div>
          <div className={styles.difs}>
            {diferenciadores.map((d) => (
              <article key={d.titulo}>
                <div className={styles.difIcon}>
                  <Image src={d.icon} alt="" width={48} height={48} />
                </div>
                <h3>{d.titulo}</h3>
                <p>{d.descripcion}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.capacitacionSection}`}>
        <div className="container container-wide">
          <div className={styles.capGrid}>
            <div className={styles.capImg}>
              <Image src="/img/nosotros/chica-limpieza.webp" alt="Capacitación profesional" width={520} height={620} />
            </div>
            <div>
              <span className={styles.eyebrowSm}>Capacitación</span>
              <h2>Fortalecemos el oficio de la limpieza</h2>
              <p>
                Capacitamos al personal y trabajadores con nuestro curso <em>Manejo y uso seguro de
                productos de limpieza y desinfección</em>, registrado ante la STPS con folio
                <strong> PCE-910401-4L7-0013</strong> que nos acredita como agentes capacitadores externos.
              </p>
              <ul className={styles.materiales}>
                <li>
                  <Image src="/img/nosotros/manuales.webp" alt="" width={48} height={48} />
                  <div><strong>Manuales de procesos</strong><span>Guías paso a paso</span></div>
                </li>
                <li>
                  <Image src="/img/nosotros/hoja-seguridad.webp" alt="" width={48} height={48} />
                  <div><strong>Hojas de seguridad</strong><span>Todas nuestras fórmulas</span></div>
                </li>
                <li>
                  <Image src="/img/nosotros/ficha-tecnica.webp" alt="" width={48} height={48} />
                  <div><strong>Fichas técnicas</strong><span>Especificaciones completas</span></div>
                </li>
                <li>
                  <Image src="/img/nosotros/ayuda-visual.webp" alt="" width={48} height={48} />
                  <div><strong>Ayudas visuales</strong><span>Para el correcto manejo</span></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.certSection}`}>
        <div className="container">
          <div className={styles.certGrid}>
            <div className={styles.certCard}>
              <Image src="/img/logo/iso-9001.webp" alt="ISO 9001" width={80} height={80} />
              <h3>Certificación ISO 9001</h3>
              <p>Sistema de gestión de calidad certificado.</p>
            </div>
            <div className={styles.certCard}>
              <div className={styles.emoji}>🏛️</div>
              <h3>Registros sanitarios</h3>
              <p>Regulados por la Secretaría de Salud de México.</p>
            </div>
            <div className={styles.certCard}>
              <div className={styles.emoji}>🌎</div>
              <h3>Empresa ESR</h3>
              <p>Reconocidos por nuestra responsabilidad social empresarial.</p>
            </div>
            <div className={styles.certCard}>
              <div className={styles.emoji}>🧴</div>
              <h3>Miembros ISSA</h3>
              <p>Asociación mundial de la industria de la limpieza.</p>
            </div>
          </div>
        </div>
      </section>

      <CtaCierre />
    </>
  );
}
