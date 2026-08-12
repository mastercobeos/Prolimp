import Image from "next/image";
import styles from "./HechoEnMexico.module.css";

export function HechoEnMexico() {
  return (
    <section className={styles.band}>
      <div className={`container container-wide ${styles.inner}`}>
        <div className={styles.visual}>
          <Image
            src="/img/redesign/productos-hecho-mexico.png"
            alt="Limpiadores Prolimp fabricados en México"
            width={420}
            height={420}
            className={styles.productos}
          />
          <Image
            src="/img/redesign/hecho-en-mexico.webp"
            alt="Hecho en México"
            width={130}
            height={130}
            className={styles.badge}
          />
        </div>
        <div className={styles.text}>
          <p>Fabricamos en México</p>
          <h2>Servimos a Todo el País</h2>
        </div>
      </div>
    </section>
  );
}
