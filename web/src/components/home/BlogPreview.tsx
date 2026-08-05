import Link from "next/link";
import styles from "./BlogPreview.module.css";
import type { BlogListItem } from "@/lib/data";

type Props = { posts: BlogListItem[] };

export function BlogPreview({ posts }: Props) {
  const recent = posts.slice(0, 3);
  return (
    <section className={`section ${styles.section}`}>
      <div className="container container-wide">
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Blog</span>
            <h2>Conoce las ventajas de la limpieza correcta</h2>
            <p>Guías, tips y buenas prácticas para profesionales de la limpieza.</p>
          </div>
          <Link href="/blog" className={styles.viewAll}>Ver todos los artículos →</Link>
        </div>

        <ul className={styles.grid}>
          {recent.map((post, i) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className={styles.card}>
                <div
                  className={styles.imgWrap}
                  style={post.image ? { backgroundImage: `url(${post.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                >
                  {!post.image && <div className={styles.number}>{String(i + 1).padStart(2, "0")}</div>}
                </div>
                <div className={styles.body}>
                  <span className={styles.tag}>Artículo</span>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <span className={styles.readMore}>Leer más →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
