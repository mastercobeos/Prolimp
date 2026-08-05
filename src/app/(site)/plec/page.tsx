import type { Metadata } from "next";
import { SectorLanding } from "@/components/landings/SectorLanding";

export const metadata: Metadata = {
  title: "Línea PLEC — Productos de Limpieza Económica",
  description: "PLEC es la línea Prolimp de productos económicos de limpieza para uso general, ideal para escuelas, oficinas, restaurantes y comercios que necesitan calidad al mejor precio.",
};

export const revalidate = 60;

export default function PlecPage() {
  return (
    <SectorLanding
      eyebrow="Línea Prolimp"
      titulo="PLEC — Limpieza"
      tituloAcento="cuidando tu bolsillo"
      lede="La línea económica de Prolimp diseñada para maximizar rendimiento sin sacrificar calidad. Ideal para escuelas, oficinas, restaurantes, comercios y usuarios de alto consumo que buscan un balance perfecto entre precio y desempeño."
      heroImage="https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1200&q=85&auto=format&fit=crop"
      productosLineaSlug="plec"
      productosLimit={12}
      ctaLede="¿Necesitas cotización por volumen para tu escuela, oficina o cadena de restaurantes? Nuestro equipo te arma un pack a la medida."
      gradienteHero="linear-gradient(135deg, rgba(0,174,239,0.18), rgba(2,116,197,0.15) 60%, rgba(12,31,110,0.12))"
      beneficios={[
        { icon: "💰", titulo: "Precio competitivo", descripcion: "Fórmulas optimizadas para reducir costo por dilución sin sacrificar poder de limpieza." },
        { icon: "📦", titulo: "Presentaciones grandes", descripcion: "Disponible en cubetas y garrafones de 5 L, 10 L y 20 L para operaciones de alto consumo." },
        { icon: "🏫", titulo: "Multi-sector", descripcion: "Ideal para escuelas, oficinas, restaurantes, hoteles, comercios y house-keeping general." },
        { icon: "🌱", titulo: "Biodegradables", descripcion: "Todos los productos PLEC son biodegradables y aptos para descarga sanitaria." },
      ]}
    />
  );
}
