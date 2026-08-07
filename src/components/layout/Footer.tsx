import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import { NewsletterForm } from "./NewsletterForm";

type NavItem = { slug: string; nombre: string };
type Empresa = {
  descripcion: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  facebook: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  fundacion: string;
  copyright: string;
};

type Props = {
  categorias: NavItem[];
  lineas: NavItem[];
  empresa: Empresa;
};

export function Footer({ categorias, lineas, empresa }: Props) {
  return (
    <footer className={styles.footer}>
      <div className="container container-wide">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/">
              <Image
                src="/img/logo/prolimp-logo.webp"
                alt="Prolimp"
                width={160}
                height={48}
                className={styles.logo}
              />
            </Link>
            <p>{empresa.descripcion}</p>
            <div className={styles.certs}>
              <Image
                src="/img/logo/iso-9001.webp"
                alt="ISO 9001 certificación"
                width={60}
                height={60}
              />
              <span>Certificación<br />ISO 9001</span>
            </div>
          </div>

          <div>
            <p className={styles.colTitle}>Empresa</p>
            <ul>
              <li><Link href="/nosotros">Nosotros</Link></li>
              <li><Link href="/sucursales">Sucursales</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contacto">Contacto</Link></li>
              <li><Link href="/aviso-de-privacidad">Aviso de privacidad</Link></li>
            </ul>
          </div>

          <div>
            <p className={styles.colTitle}>Productos</p>
            <ul>
              {categorias.slice(0, 6).map((c) => (
                <li key={c.slug}><Link href={`/productos/${c.slug}`}>{c.nombre}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className={styles.colTitle}>Líneas propias</p>
            <ul>
              {lineas.slice(0, 6).map((l) => (
                <li key={l.slug}><Link href={`/productos/quimicos/${l.slug}`}>{l.nombre}</Link></li>
              ))}
            </ul>
          </div>

          <div className={styles.contactCol}>
            <p className={styles.colTitle}>Contacto</p>
            <ul>
              <li>
                <a href={`https://wa.me/${empresa.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp {empresa.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${empresa.email}`}>{empresa.email}</a>
              </li>
              <li>
                <Link href="/descarga-catalogo">Descargar catálogo</Link>
              </li>
              <li>
                <Link href="/aviso-de-privacidad">Aviso de privacidad</Link>
              </li>
              <li>
                <Link href="/terminos-y-condiciones">Términos y condiciones</Link>
              </li>
            </ul>
            <div className={styles.socials}>
              {empresa.facebook && <a href={empresa.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">FB</a>}
              {empresa.instagram && <a href={empresa.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>}
              {empresa.linkedin && <a href={empresa.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">IN</a>}
              {empresa.youtube && <a href={empresa.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">YT</a>}
            </div>
          </div>
        </div>

        <div className={styles.newsletter}>
          <NewsletterForm />
        </div>

        <div className={styles.bottom}>
          <span>{empresa.copyright}</span>
          <span>Fabricantes mexicanos desde {empresa.fundacion}</span>
          <a
            href="https://growflowautomat.com/en"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.madeBy}
          >
            Sitio hecho por
            <span>Grow Flow Automation</span>
            <Image
              src="/img/logo/growflow-icon.png"
              alt=""
              width={16}
              height={16}
              aria-hidden
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
