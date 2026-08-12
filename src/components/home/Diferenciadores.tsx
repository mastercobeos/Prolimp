import Image from "next/image";
import styles from "./Diferenciadores.module.css";

type Props = {
  items: { titulo: string; descripcion: string; icon: string }[];
};

const sellos = [
  {
    img: "/img/redesign/sello-nsf.webp",
    titulo: "NSF International",
    descripcion: "Registro ante la National Science Foundation, producto seguro para la industria alimentaria.",
  },
  {
    img: "/img/redesign/sello-desinfeccion.webp",
    titulo: "Desinfección garantizada",
    descripcion: "Nuestros productos cuentan con retos microbianos que aseguran su efectividad.",
  },
  {
    img: "/img/redesign/sello-kosher.webp",
    titulo: "Certificación Kosher",
    descripcion: "Contamos con certificación que avala el cumplimiento de los estándares de la Ley Judía.",
  },
  {
    img: "/img/redesign/sello-virus.webp",
    titulo: "Eficaz contra virus",
    descripcion: "Efectividad contra virus de características similares a SARS-COV-2 comprobada.",
  },
];

export function Diferenciadores({ items }: Props) {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Nuestra fórmula</span>
          <h2>Qué hace diferentes a nuestros limpiadores</h2>
          <p>
            Cada limpiador Prolimp® ha sido desarrollado para ofrecer resultados profesionales con
            mayor rendimiento, eficiencia y seguridad en cada aplicación.
          </p>
        </div>
        <ul className={styles.grid}>
          {items.map((d) => (
            <li key={d.titulo} className={styles.card}>
              <div className={styles.iconWrap}>
                <Image src={d.icon} alt="" width={64} height={64} />
              </div>
              <h3>{d.titulo}</h3>
              <p>{d.descripcion}</p>
            </li>
          ))}
        </ul>

        <p className={styles.sellosNota}>
          Algunas de nuestras fórmulas cuentan con certificaciones y pruebas de efectividad
          microbiológica y virucida.
        </p>
        <ul className={styles.sellos}>
          {sellos.map((s) => (
            <li key={s.titulo}>
              <div className={styles.selloImg}>
                <Image src={s.img} alt={s.titulo} width={600} height={450} />
              </div>
              <h3>{s.titulo}</h3>
              <p>{s.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
