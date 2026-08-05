import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog · Guías y tips de limpieza profesional",
  description:
    "Artículos, guías y consejos para profesionales de la limpieza industrial, hotelera y de servicios. Todo lo que necesitas saber para mantener espacios impecables.",
};

const gradients = [
  "linear-gradient(135deg, #0274c5, #00aeef)",
  "linear-gradient(135deg, #0c1f6e, #0274c5)",
  "linear-gradient(135deg, #00aeef, #16a34a)",
  "linear-gradient(135deg, #0274c5, #0c1f6e)",
  "linear-gradient(135deg, #024f88, #00aeef)",
  "linear-gradient(135deg, #0c1f6e, #024f88)",
];

const bgStyle = (post: { image?: string }, i: number) =>
  post.image
    ? { backgroundImage: `url(${post.image})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: gradients[i % gradients.length] };

export default async function BlogPage() {
  const posts = await getPosts();
  const featured = posts.find((p) => p.destacado) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured?.slug);
  return (
    <>
      <section className={styles.hero}>
        <div className="container container-wide">
          <span className={styles.eyebrow}>Blog Prolimp</span>
          <h1>Conoce las ventajas de la limpieza correcta</h1>
          <p>Guías, técnicas y buenas prácticas para elevar el estándar de limpieza de tu operación.</p>
        </div>
      </section>

      <section className={`section ${styles.list}`}>
        <div className="container container-wide">
          {featured && (
            <Link href={`/blog/${featured.slug}`} className={styles.featured}>
              <div className={styles.featuredImg} style={bgStyle(featured, 0)}>
                <span className={styles.badge}>Destacado</span>
              </div>
              <div className={styles.featuredBody}>
                <span className={styles.tag}>Artículo destacado</span>
                <h2>{featured.title}</h2>
                <p>{featured.description}</p>
                <span className={styles.readMore}>Leer artículo completo →</span>
              </div>
            </Link>
          )}

          <ul className={styles.grid}>
            {rest.map((post, i) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className={styles.card}>
                  <div className={styles.cardImg} style={bgStyle(post, i + 1)}>
                    {!post.image && <span className={styles.number}>{String(i + 2).padStart(2, "0")}</span>}
                  </div>
                  <div className={styles.cardBody}>
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
    </>
  );
}
