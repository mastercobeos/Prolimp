import type { Metadata } from "next";
import { SectorLanding } from "@/components/landings/SectorLanding";

export const metadata: Metadata = {
  title: "Limpieza para industria alimentaria",
  description: "Químicos y sistemas de limpieza para plantas de alimentos, procesadoras y empaque. Fórmulas Prolimp que cumplen con normativas de sanidad y BPM.",
};

export const revalidate = 60;

export default function IndustriaAlimentariaPage() {
  return (
    <SectorLanding
      catalogoSlug="industria-alimentaria"
      eyebrow="Industria alimentaria"
      titulo="Limpieza y sanitización para"
      tituloAcento="plantas de alimentos"
      lede="Limpiadores, desengrasantes y desinfectantes desarrollados para apoyar rutinas de limpieza y sanitización en plantas de alimentos, cocinas industriales, procesadoras y áreas de trabajo donde la higiene debe mantenerse bajo control."
      heroImage="https://images.pexels.com/photos/5532717/pexels-photo-5532717.jpeg?auto=compress&cs=tinysrgb&w=1200"
      sellos
      productosSlugs={[
        "deterfoam-l-i-detergente-alcalino-clorado-alta-espuma",
        "ultra-k-i-detergente-alcalino-baja-espuma",
        "deterprol-s-e-i-detergente-alcalino-clorado-sin-espuma",
        "alkaprol-detergente-alcalino-clorado",
        "ad-s-e-i-detergente-acido-desincrustante-sin-espuma",
        "alumiprol-limpiador-y-abrillantador-de-aluminio",
      ]}
      ctaLede="Diseñamos protocolos de sanitización según tu proceso: recepción de materia prima, línea de producción, envasado y almacén. Auditamos, capacitamos y suministramos."
      beneficios={[
        { icon: "medalla", titulo: "NSF, Kosher y Desinfección", descripcion: "Respaldo para procesos donde la inocuidad importa. Fórmulas seleccionadas con retos microbianos y virucidas para procesos de desinfección profesional." },
        { icon: "norma", titulo: "Cumplimiento normativo", descripcion: "NOM-251-SSA1, BPM, HACCP y auditorías de sanidad. Fichas técnicas y hojas de seguridad de cada producto." },
        { icon: "cip", titulo: "CIP y COP", descripcion: "Detergentes alcalinos, ácidos y desinfectantes para limpieza en sitio (CIP) y equipos desmontables." },
        { icon: "sectores", titulo: "Todos los sectores", descripcion: "Cárnicos, panaderías, procesadoras, envasado, bebidas, congelados y cadena de frío." },
      ]}
    />
  );
}
