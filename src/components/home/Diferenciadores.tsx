import Image from "next/image";
import styles from "./Diferenciadores.module.css";

type Props = {
  items: { titulo: string; descripcion: string; icon: string }[];
};

export function Diferenciadores({ items }: Props) {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Nuestra fórmula</span>
          <h2>Qué hace diferentes a nuestros químicos</h2>
          <p>
            Cada producto Prolimp® tiene retos microbianos, virucidas y registro NSF. Efectividad
            probada en la industria alimentaria y ambientes críticos.
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
      </div>
    </section>
  );
}
