import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PrivacyNotice from "../PrivacyNotice";
import { LAST_UPDATED, NOTICES } from "../notices";
import styles from "../page.module.css";

type Props = { params: Promise<{ empresa: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return NOTICES.map((n) => ({ empresa: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { empresa } = await params;
  const notice = NOTICES.find((n) => n.slug === empresa);
  if (!notice) return {};
  return {
    title: `Aviso de privacidad ${notice.name}`,
    description: `Aviso de privacidad de ${notice.legalName} conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.`,
    robots: { index: true, follow: true },
  };
}

export default async function AvisoEmpresaPage({ params }: Props) {
  const { empresa } = await params;
  const notice = NOTICES.find((n) => n.slug === empresa);
  if (!notice) notFound();

  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <header className={styles.header}>
          <Link href="/aviso-de-privacidad" className={styles.back}>← Avisos de privacidad</Link>
          <span className={styles.eyebrow}>Aviso de privacidad</span>
          <h1>{notice.name}</h1>
          <p className={styles.updated}>Última actualización: {LAST_UPDATED}</p>
        </header>

        <PrivacyNotice legalName={notice.legalName} address={notice.address} />
      </article>
    </main>
  );
}
