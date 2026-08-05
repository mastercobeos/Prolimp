import type { Metadata } from "next";
import { SectorLanding } from "@/components/landings/SectorLanding";

export const metadata: Metadata = {
  title: "SIBA Pro — Sistema profesional para empresas",
  description: "SIBA Pro es el sistema de higiene profesional para empresas medianas y grandes. Dispensadores premium, suministro programado y mantenimiento con SLA.",
};

export const revalidate = 60;

export default function SibaProPage() {
  return (
    <SectorLanding
      eyebrow="SIBA Pro"
      titulo="SIBA Pro para"
      tituloAcento="operaciones exigentes"
      lede="La versión profesional de SIBA para empresas medianas y grandes: dispensadores automáticos premium con sensor infrarrojo, suministro programado mensual, dashboard de consumos y respuesta técnica con SLA menor a 24 horas."
      heroImage="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&q=85&auto=format&fit=crop"
      productosCategoriaSlug="dosificadores"
      productosLimit={8}
      ctaLede="Solicita una auditoría técnica gratuita. Evaluamos aforo, patrones de uso y presupuesto para armar el pack SIBA Pro que optimice inversión y experiencia."
      gradienteHero="linear-gradient(135deg, rgba(0,174,239,0.22), rgba(2,116,197,0.20) 60%, rgba(12,31,110,0.15))"
      beneficios={[
        { icon: "🎯", titulo: "Dispensadores premium", descripcion: "Sensor infrarrojo touch-free, capacidad ampliada y acabados metalizados en línea con estética corporativa." },
        { icon: "📊", titulo: "Dashboard de consumos", descripcion: "Reporte mensual con métricas de uso, proyección de rellenos y ahorro histórico vs. sistemas tradicionales." },
        { icon: "🚚", titulo: "Suministro programado", descripcion: "Papel, jabón y aromatizantes entregados en la cadencia exacta que consume tu operación. Sin quiebres de stock." },
        { icon: "⚡", titulo: "SLA técnico < 24h", descripcion: "Reemplazo de piezas, mantenimiento y soporte técnico prioritario con tiempo de respuesta garantizado por contrato." },
      ]}
    />
  );
}
