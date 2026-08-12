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
      tema="rojo"
      eyebrow="Limpieza y ahorro"
      tituloPrefijo="PLEC -"
      titulo="Limpieza que ayuda a cuidar tu bolsillo"
      lede="Productos diseñados para ahorrar en la operación diaria. Ideales para escuelas, oficinas, restaurantes, comercios y espacios de alto consumo que buscan buen costo por uso y desempeño confiable."
      heroImage="/img/redesign/plec-hero.webp"
      heroAspecto="1 / 1"
      bandaPlec
      eyebrowSeccion="Por qué PLEC"
      beneficiosTitulo="Productos diseñados para cuidar tu presupuesto"
      productosTitulo="Algunos productos ideales para ahorrar"
      productosSlugs={[
        "fast-clean-limpiador-multiusos-aroma-mar-fresco",
        "fast-clean-limpiador-multiusos-aroma-lima-limon",
        "fast-clean-limpiador-multiusos-con-aroma",
        "ecox-detergente-liquido",
        "tapete-liso-para-mingitorio",
        "sarricida-desincrustante-sarriprol",
        "toalla-interdoblada-gcpaper-100-hjs",
        "pinolimp-limpiador-multiusos-base-aceite-de-pino",
      ]}
      ctaTitulo="¿Buscas ahorrar en tu operación diaria?"
      ctaLede="Te ayudamos a elegir productos PLEC según el consumo, tipo de espacio y necesidades de limpieza de tu empresa."
      gradienteHero="linear-gradient(135deg, rgba(0,174,239,0.18), rgba(2,116,197,0.15) 60%, rgba(12,31,110,0.12))"
      beneficios={[
        { icon: "precio", titulo: "Precio competitivo", descripcion: "Productos pensados para operaciones que necesitan limpiar constantemente y controlar mejor su gasto." },
        { icon: "presentaciones", titulo: "Presentaciones variables", descripcion: "Productos y formatos pensados para operaciones que requieren compra recurrente, reposición frecuente y mejor control del gasto." },
        { icon: "multisector", titulo: "Uso multisector", descripcion: "Una opción práctica para distintos tipos de empresas, negocios e instituciones que buscan resolver necesidades frecuentes de limpieza." },
        { icon: "desempeno", titulo: "Desempeño funcional", descripcion: "Productos desarrollados para cumplir con tareas de limpieza diaria de forma sencilla y eficiente." },
      ]}
    />
  );
}
