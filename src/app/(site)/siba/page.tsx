import type { Metadata } from "next";
import { SectorLanding } from "@/components/landings/SectorLanding";

export const metadata: Metadata = {
  title: "SIBA — Sistema Integral de Baños",
  description: "SIBA es el sistema integral de higiene para baños de tu empresa: dispensadores, papel, jabón, aromatizantes y bacteria digestora. Todo en uno.",
};

export const revalidate = 60;

export default function SibaPage() {
  return (
    <SectorLanding
      eyebrow="SIBA"
      titulo="Sistema Integral"
      tituloAcento="de Baños"
      lede="Convertimos los baños de tu empresa en un espacio limpio, seguro y con imagen premium. Instalamos dispensadores, aromatizamos, suministramos papel, jabón y damos mantenimiento continuo con un solo contrato."
      heroImage="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=85&auto=format&fit=crop"
      productosCategoriaSlug="dosificadores"
      productosLimit={8}
      ctaLede="Agenda una visita técnica gratuita. Un asesor evalúa tus baños, mide consumos y arma la propuesta SIBA a la medida de tu operación."
      gradienteHero="linear-gradient(135deg, rgba(0,174,239,0.20), rgba(2,116,197,0.15) 60%, rgba(12,31,110,0.10))"
      beneficios={[
        { icon: "🚻", titulo: "Todo en uno", descripcion: "Dispensadores de papel, jabón, toalla, aroma y bacteria para trampa de grasa. Instalación incluida." },
        { icon: "💡", titulo: "Imagen premium", descripcion: "Equipamiento moderno con acabados que elevan la percepción de tu marca ante clientes y empleados." },
        { icon: "🔄", titulo: "Suministro mensual", descripcion: "Rellenos programados de papel, jabón, aromatizantes. Nunca te quedas sin inventario." },
        { icon: "🛠️", titulo: "Mantenimiento continuo", descripcion: "Reemplazo de piezas gastadas, actualización de dispensadores y soporte técnico bajo el mismo contrato." },
      ]}
    />
  );
}
