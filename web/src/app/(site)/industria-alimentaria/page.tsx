import type { Metadata } from "next";
import { SectorLanding } from "@/components/landings/SectorLanding";

export const metadata: Metadata = {
  title: "Limpieza para industria alimentaria",
  description: "Químicos y sistemas de limpieza para plantas de alimentos, procesadoras y empaque. Línea PLEC de Prolimp cumple con normativas de sanidad y BPM.",
};

export const revalidate = 60;

export default function IndustriaAlimentariaPage() {
  return (
    <SectorLanding
      eyebrow="Industria alimentaria"
      titulo="Limpieza y sanitización para"
      tituloAcento="plantas de alimentos"
      lede="Fórmulas grado alimenticio, cumplimiento con NOM-251-SSA1 y buenas prácticas de manufactura. Detergentes alcalinos, desinfectantes yodóforos, sanitizantes para superficies en contacto con alimentos y equipos CIP."
      heroImage="https://images.unsplash.com/photo-1615394054350-a90a3ac09310?w=1200&q=85&auto=format&fit=crop"
      productosLineaSlug="plec"
      productosLimit={8}
      ctaLede="Diseñamos protocolos de sanitización según tu proceso: recepción de materia prima, línea de producción, envasado y almacén. Auditamos, capacitamos y suministramos."
      beneficios={[
        { icon: "🧪", titulo: "Grado alimenticio", descripcion: "Fórmulas aprobadas para contacto con alimentos, biodegradables y libres de residuos tóxicos." },
        { icon: "✅", titulo: "Cumplimiento normativo", descripcion: "NOM-251-SSA1, BPM, HACCP y auditorías de sanidad. Fichas técnicas y hojas de seguridad de cada producto." },
        { icon: "🧼", titulo: "CIP y COP", descripcion: "Detergentes alcalinos, ácidos y desinfectantes para limpieza en sitio (CIP) y equipos desmontables." },
        { icon: "🥩", titulo: "Todos los sectores", descripcion: "Cárnicos, panaderías, procesadoras, envasado, bebidas, congelados y cadena de frío." },
      ]}
    />
  );
}
