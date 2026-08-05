import type { Metadata } from "next";
import { SectorLanding } from "@/components/landings/SectorLanding";

export const metadata: Metadata = {
  title: "Limpieza para industria láctea",
  description: "Detergentes alcalinos y ácidos para tanques, tuberías CIP y sala de ordeño. Especializados para queserías, procesadoras de leche y establos.",
};

export const revalidate = 60;

export default function IndustriaLacteaPage() {
  return (
    <SectorLanding
      eyebrow="Industria láctea"
      titulo="Higiene profesional para"
      tituloAcento="lácteos y quesos"
      lede="Removemos residuos proteicos y minerales sin corroer acero inoxidable. Línea especializada para procesadoras de leche, queserías, salas de ordeño y equipos de pasteurización."
      heroImage="https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=1200&q=85&auto=format&fit=crop"
      productosLineaSlug="plec"
      productosLimit={6}
      ctaLede="Nuestros técnicos diseñan la rotación alcalino-ácido correcta para que tus superficies queden libres de biofilms y depósitos de calcio."
      gradienteHero="linear-gradient(135deg, rgba(0,174,239,0.15), rgba(255,255,255,0.6) 60%, rgba(2,116,197,0.12))"
      beneficios={[
        { icon: "🥛", titulo: "Remueve leche y proteína", descripcion: "Detergentes alcalinos que disuelven residuos grasos y proteicos sin dejar espuma en enjuague." },
        { icon: "⚗️", titulo: "Descalcifica minerales", descripcion: "Ácidos que eliminan sarro, depósitos de calcio y biofilm sin dañar acero inoxidable." },
        { icon: "💧", titulo: "Aptos CIP", descripcion: "Bajo espumante, enjuague fácil, ideales para sistemas de limpieza en sitio automatizados." },
        { icon: "🧫", titulo: "Sanitizantes", descripcion: "Yodóforos y ácido peracético para desinfección final de superficies en contacto con producto." },
      ]}
    />
  );
}
