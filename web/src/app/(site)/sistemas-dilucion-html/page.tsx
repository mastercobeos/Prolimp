import type { Metadata } from "next";
import styles from "../sistemas-dilucion/page.module.css";

export const metadata: Metadata = {
  title: "Sistemas de Dilución (HTML estático)",
  description:
    "Sistemas de dosificación y de dilución de limpiadores químicos Prolimp. Dosifica automáticamente detergentes, desinfectantes y desengrasantes.",
};

const beneficios = [
  "Dosificación precisa y automática — evita desperdicio",
  "Reduce costo por dilución de químicos concentrados",
  "Sin exposición del usuario al químico concentrado",
  "Se ajusta a diferentes tipos de máquinas y químicos",
  "Aumenta la vida útil de tus productos de limpieza",
  "Cumplimiento de buenas prácticas de manufactura (BPM)",
];

const sistemas = [
  {
    titulo: "Dilutor Dema",
    descripcion: "Sistema de dilución para preparar diluciones exactas de químicos concentrados en un solo punto de dosificación.",
  },
  {
    titulo: "Dosificador para lavaloza Sprite Ware Wash DM-420",
    descripcion: "Dosifica detergente líquido y abrillantador para máquinas lavaloza industriales de baja y alta temperatura.",
  },
  {
    titulo: "Dosificador para trampa de grasa Autodose",
    descripcion: "Programa dosificaciones automáticas de bacteria digestora de grasa hacia trampas de grasa industriales.",
  },
  {
    titulo: "Dilutor para 1 producto Accupro",
    descripcion: "Sistema compacto de dilución para 1 sola solución química, ideal para cubetas y atomizadores.",
  },
  {
    titulo: "Sistema Multi-producto",
    descripcion: "Estación de dilución para hasta 4 químicos diferentes en un solo punto, ideal para house-keeping.",
  },
];

export default function SistemasDilucionHtmlPage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Optimización de químicos</span>
          <h1 className={styles.title}>Sistemas de Dilución y Dosificación</h1>
          <p className={styles.subtitle}>
            Sistemas de dosificación automática de detergentes, desinfectantes y desengrasantes para lavanderías,
            cocinas y estaciones de limpieza industriales. Dosifica con precisión, protege al usuario y reduce el
            costo por dilución.
          </p>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.prose}>
          <p>
            Los sistemas de dilución Prolimp permiten preparar diluciones exactas de químicos concentrados en el
            punto de uso. Están diseñados para lavanderías industriales, cocinas comerciales y áreas de
            house-keeping donde el consumo de químicos es alto.
          </p>
          <p>
            Cada equipo se conecta a una toma de agua y a los envases de químico concentrado, y entrega la solución
            diluida en la proporción exacta. Esto asegura que el producto rinda al máximo, que la limpieza sea
            consistente y que el operador no manipule concentrados peligrosos.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Beneficios clave</h2>
        <ul className={styles.benefitList}>
          {beneficios.map((b) => (
            <li key={b}>
              <span className={styles.check} aria-hidden>✓</span>
              {b}
            </li>
          ))}
        </ul>
      </section>

      {sistemas.map((s) => (
        <section key={s.titulo} className={styles.section}>
          <h2>{s.titulo}</h2>
          <div className={styles.prose}>
            <p>{s.descripcion}</p>
          </div>
        </section>
      ))}
    </main>
  );
}
