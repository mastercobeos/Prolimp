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
      titulo="Limpieza profesional para"
      tituloAcento="la industria láctea y quesera"
      lede="Limpiadores y desinfectantes profesionales para apoyar la higiene en queserías, procesadoras de leche, salas de ordeño y áreas de producción. Ayudan a remover residuos grasos, proteicos y minerales generados durante la operación diaria."
      heroImage="/img/redesign/lactea-hero.webp"
      sellos
      beneficiosTitulo="Fórmulas diseñadas para la industria láctea y quesera"
      productosSlugs={[
        "deterfoam-l-i-detergente-alcalino-clorado-alta-espuma",
        "ultra-k-i-detergente-alcalino-baja-espuma",
        "deterprol-s-e-i-detergente-alcalino-clorado-sin-espuma",
        "alkaprol-detergente-alcalino-clorado",
      ]}
      ctaLede="Te ayudamos a elegir los productos adecuados y a definir rutinas de limpieza y sanitización para queserías, procesadoras de leche, salas de ordeño y áreas de trabajo."
      gradienteHero="linear-gradient(135deg, rgba(0,174,239,0.15), rgba(255,255,255,0.6) 60%, rgba(2,116,197,0.12))"
      beneficios={[
        { icon: "grasa", titulo: "Remoción de grasa y proteína", descripcion: "Limpiadores alcalinos que ayudan a remover suciedad propia del proceso, como grasa, leche, proteína y materia orgánica." },
        { icon: "sarro", titulo: "Remoción de sarro y minerales", descripcion: "Fórmulas ácidas para apoyar la remoción de incrustaciones, sales minerales y residuos adheridos en superficies y equipos." },
        { icon: "cip", titulo: "Limpieza CIP y COP", descripcion: "Fórmulas para apoyar la limpieza de circuitos cerrados, equipos y piezas desmontables dentro de procesos lácteos y queseros." },
        { icon: "desinfeccion", titulo: "Desinfección con respaldo", descripcion: "Sanitizantes y desinfectantes con documentación técnica para apoyar procesos de higiene e inocuidad en planta." },
      ]}
    />
  );
}
