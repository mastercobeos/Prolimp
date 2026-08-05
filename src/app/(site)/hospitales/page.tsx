import type { Metadata } from "next";
import { SectorLanding } from "@/components/landings/SectorLanding";

export const metadata: Metadata = {
  title: "Limpieza hospitalaria y clínicas",
  description: "Desinfectantes de amplio espectro, virucidas y sanitizantes para hospitales, clínicas, laboratorios y consultorios. Línea Higiene de Prolimp.",
};

export const revalidate = 60;

export default function HospitalesPage() {
  return (
    <SectorLanding
      eyebrow="Sector salud"
      titulo="Higiene profesional para"
      tituloAcento="hospitales y clínicas"
      lede="Desinfectantes de amplio espectro con retos microbianos, virucidas y bactericidas para áreas críticas: quirófanos, UCI, hospitalización, urgencias y consultorios. Cumplen con COFEPRIS."
      heroImage="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1200&q=85&auto=format&fit=crop"
      productosLineaSlug="higiene"
      productosLimit={8}
      ctaLede="Diseñamos el protocolo de limpieza y desinfección para tu unidad médica: áreas administrativas, comunes, hospitalización, urgencias y quirófanos."
      gradienteHero="linear-gradient(135deg, rgba(0,174,239,0.14), rgba(2,116,197,0.10) 60%, rgba(255,255,255,0.6))"
      beneficios={[
        { icon: "🦠", titulo: "Virucida y bactericida", descripcion: "SAN-100, Termocitrus y otros con retos microbianos comprobados. Elimina virus envueltos y no envueltos." },
        { icon: "🏥", titulo: "Áreas críticas", descripcion: "Fórmulas específicas para quirófanos, UCI, salas de espera y consultorios. Sin residuo tóxico." },
        { icon: "✅", titulo: "COFEPRIS", descripcion: "Registros sanitarios vigentes. Fichas técnicas y hojas de seguridad de cada producto." },
        { icon: "🧴", titulo: "Gel y jabón antibacterial", descripcion: "Prol Gel 70, Jabonlimp y toallitas desinfectantes para higiene de manos del personal." },
      ]}
    />
  );
}
