import Image from "next/image";
import type { Metadata } from "next";
import { CtaBand } from "@/components/shared/CtaBand";
import { getSistemasDilucion } from "@/lib/data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sistemas de Dilución",
  description:
    "Sistemas de dosificación y de dilución de limpiadores químicos Prolimp. Reduce costos, prolonga la vida útil de tus concentrados y optimiza el uso de químicos.",
};

export const revalidate = 60;

const HERO_LEDE =
  "Dosifican de manera automática una gran variedad de soluciones. El equipo de dosificación es automatizado y proporciona dosis exactas reduciendo costos de consumo de agua, energía y producto químico. Además de asegurar el correcto uso del producto químico, no exponer al usuario.";

const HERO_BENEFITS = ["Dosificación precisa", "No desperdicio", "Fácil manejo"];

const TEKSTIL_BLOCKS = [
  {
    titulo: "El controlador",
    texto:
      "Permite sacar un reporte detallado de la cantidad de producto empleado y el rendimiento por kilo de ropa lavada. Aquí elija la fórmula para trabajar, puede ser programado hasta con 20 fórmulas.",
  },
  {
    titulo: "Las bombas dosificadoras",
    texto:
      "Succionan la cantidad exacta de producto químico a utilizar enviando la dilución correcta a la máquina de lavado.",
  },
  {
    titulo: "Los procedimientos y fórmulas",
    texto: "Son diseñados de acuerdo al tipo de ropa o la suciedad que contienen las prendas a lavar.",
  },
  {
    titulo: "Seguridad",
    texto:
      "Este equipo, al evitar manipulación de los productos, optimiza el consumo y contribuye a la seguridad de los operarios.",
  },
];

const PROOMNI_BLOCKS = [
  {
    titulo: "Fórmulas concentradas",
    texto:
      "Que reducen los costos de limpieza, en comparación a productos listos para usar disponibles en el mercado.",
  },
  {
    titulo: "Ahorra tiempo y esfuerzo",
    texto: "Ya que con sólo pulsar un botón obtendrá la dosificación de químicos precisa y constante.",
  },
  {
    titulo: "Controla la calidad",
    texto:
      "En los procesos de limpieza al tener las dosificaciones correctas para el funcionamiento del producto químico.",
  },
  {
    titulo: "Optimiza el consumo",
    texto:
      "Asegura la dosis adecuada de los productos químicos, evitando su desperdicio y haciéndolo más rentable.",
  },
  {
    titulo: "Evita la manipulación directa",
    texto:
      "Minimizando así la posibilidad de que ocurran accidentes de trabajo y asegurando a los operarios.",
  },
];

const OTROS_EQUIPOS = [
  {
    titulo: "Dilutor Dema",
    img: "/img/redesign/dilutor-dema.jpg",
    texto:
      "Cuerpo de latón niquelado que se adhiere a cualquier grifo estándar y dispensa producto mezclado con agua del fregadero con sólo presionar o empujar un botón.",
  },
  {
    titulo: "Sprite Ware Wash DM-420",
    img: "/img/redesign/sprite-pared.jpg",
    texto:
      "Dosificador para máquina lavaloza, la dosificación de los productos se lleva a cabo con este equipo, que recibe las señales de lavado y enjuague, dosificando el producto adecuado en la cantidad programada.",
  },
  {
    titulo: "Autodose",
    img: "/img/redesign/autodose-sala.jpg",
    texto:
      "Dosificador para trampa de grasa. Dosifica de forma automática la cantidad de producto programada en los tiempos establecidos. Puede elegir hasta 24 periodos de dosificación por 24 horas. Elección del día, la hora y dosificaciones.",
  },
  {
    titulo: "Accupro",
    img: "/img/redesign/accupro.jpg",
    texto:
      "Dilutor para 1 producto, proporciona de manera fácil y constante la solución con sólo pulsar un botón. Este equipo permite la dosificación exacta de detergente y desinfectante para los procesos de lavado y desinfección de frutas y verduras así como de loza.",
  },
];

function CheckIcon() {
  return (
    <svg
      className={styles.checkIcon}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function SistemasDilucionPage() {
  const data = await getSistemasDilucion();
  const heroLede = HERO_LEDE;
  const beneficios = (data?.beneficios?.length ? data.beneficios : HERO_BENEFITS).map((b) =>
    b.replace(/\.$/, "")
  );

  return (
    <main className={styles.page}>
      {/* 1. Hero */}
      <header className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <span className={styles.kicker}>Sistemas de dilución</span>
              <h1 className={styles.title}>
                Sistema de dosificación y dilución{" "}
                <span className={styles.titleAccent}>de limpiadores químicos</span>
              </h1>
              <p className={styles.heroLede}>{heroLede}</p>
              <p className={styles.benefitsLabel}>Beneficios clave:</p>
              <ul className={styles.benefitList}>
                {beneficios.map((b) => (
                  <li key={b}>
                    <CheckIcon />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.heroCard}>
              <Image
                src="/img/redesign/dilucion-hero.webp"
                alt="Equipos de dosificación y dilución Prolimp"
                width={1200}
                height={1149}
                priority
                className={styles.heroImage}
              />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Tekstil Pro */}
      <section className={styles.tinted}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Tekstil Pro</h2>
            <p className={styles.sectionSubtitle}>
              Sistema de dosificación automática de detergentes líquidos para lavanderías
              Industriales
            </p>
            <p className={styles.sectionLede}>
              El equipo de dosificación es automatizado y proporciona dosis exactas reduciendo
              costos de consumo de agua, energía y producto químico.
            </p>
          </div>
          <div className={styles.splitGrid}>
            <div className={styles.illustrationCard}>
              <Image
                src="/img/redesign/tekstil-isometrico.png"
                alt="Ilustración del sistema Tekstil Pro conectado a una lavadora industrial"
                width={640}
                height={760}
                className={styles.illustration}
              />
            </div>
            <div className={styles.blocksCol}>
              <Image
                src="/img/redesign/tekstil-bombas.png"
                alt="Bombas dosificadoras y controlador Tekstil Pro"
                width={560}
                height={220}
                className={styles.pumpsImage}
              />
              {TEKSTIL_BLOCKS.map((b) => (
                <div key={b.titulo} className={styles.infoBlock}>
                  <h3>{b.titulo}</h3>
                  <p>{b.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Banda CTA folleto dosificación */}
      <CtaBand
        variant="marino"
        titulo="Conoce más"
        lede="Descarga el folleto y revisa cómo funciona el sistema de dosificación"
        cta="Descargar folleto"
        href="/descarga-catalogo"
      />

      {/* 4. Pro Omni */}
      <section className={styles.tinted}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Pro Omni</h2>
            <p className={styles.sectionSubtitle}>
              Sistema de dilución de limpiadores químicos concentrados para limpieza y desinfección
              de áreas.
            </p>
            <p className={styles.sectionLede}>
              Dosifica de manera automática una gran variedad de soluciones diluidas, las cuáles
              pueden ser depositadas en botellas rociadoras, cubetas o cualquier otro contenedor.
            </p>
          </div>
          <div className={styles.splitGrid}>
            <div className={styles.blocksCol}>
              <Image
                src="/img/redesign/proomni-caja.png"
                alt="Caja dosificadora Pro Omni"
                width={280}
                height={200}
                className={styles.boxImage}
              />
              {PROOMNI_BLOCKS.map((b) => (
                <div key={b.titulo} className={styles.infoBlock}>
                  <h3>{b.titulo}</h3>
                  <p>{b.texto}</p>
                </div>
              ))}
            </div>
            <div className={styles.illustrationCard}>
              <Image
                src="/img/redesign/proomni-isometrico.png"
                alt="Ilustración del sistema Pro Omni con carrito exprimidor"
                width={640}
                height={880}
                className={styles.illustration}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4b. Banda CTA folleto dilución */}
      <CtaBand
        variant="marino"
        titulo="Conoce más"
        lede="Descarga el folleto y revisa cómo funciona el sistema de dilución"
        cta="Descargar folleto"
        href="/descarga-catalogo"
      />

      {/* 5. Otros equipos */}
      <section className={styles.equipos}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Otros equipos de dosificación</h2>
            <p className={styles.sectionLede}>
              Equipos de dosificación automatizados que proporcionan dosis exactas reduciendo
              costos de consumo de agua, energía y producto químico.
            </p>
          </div>
          <ul className={styles.equiposGrid}>
            {OTROS_EQUIPOS.map((e) => (
              <li key={e.titulo} className={styles.equipoCard}>
                <div className={styles.equipoImgWrap}>
                  <Image src={e.img} alt={e.titulo} width={400} height={300} className={styles.equipoImg} />
                </div>
                <h3>{e.titulo}</h3>
                <p>{e.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Banda CTA asesoría */}
      <CtaBand
        variant="azul"
        titulo="¿Necesitas asesoría para tu operación?"
        lede="Nuestro equipo te ayuda a elegir e implementar el sistema de dosificación ideal para tu operación."
        cta="Contactar con un Asesor"
        href="/contacto"
      />
    </main>
  );
}
