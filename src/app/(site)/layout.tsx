import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { getCategorias, getLineas, getEmpresa } from "@/lib/data";
import { SanityLive } from "@/sanity/live";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [categorias, lineas, empresa] = await Promise.all([
    getCategorias(),
    getLineas(),
    getEmpresa(),
  ]);

  return (
    <>
      <Header categorias={categorias} lineas={lineas} />
      <main id="main">{children}</main>
      <Footer categorias={categorias} lineas={lineas} empresa={empresa} />
      <WhatsAppButton
        whatsapp={empresa.whatsapp}
        facebook={empresa.facebook}
        instagram={empresa.instagram}
        linkedin={empresa.linkedin}
        youtube={empresa.youtube}
      />
      <CookieBanner />
      <SanityLive />
    </>
  );
}
