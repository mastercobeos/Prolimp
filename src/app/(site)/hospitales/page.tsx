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
      titulo="Higiene profesional"
      tituloAcento="para hospitales y clínicas y consultorios"
      lede="Limpiadores y desinfectantes para áreas generales de hospitales, clínicas y consultorios, pensados para mantener espacios más limpios, seguros y controlados en la operación diaria."
      heroImage="/img/redesign/hospitales-hero.webp"
      productosSlugs={[
        "germiprol-s-p-detergente-sanitizante-a-base-de-sales-cuaternarias",
        "desengrasante-dp1-concentrado",
        "clorolimp-blanqueador-desinfectante-y-deodorizante-al-6",
        "desinfectante-virucida-san-100",
      ]}
      ctaTitulo="¿Necesitas apoyo para mejorar tu proceso de limpieza?"
      ctaLede="Te ayudamos a elegir los productos adecuados y a definir rutinas de limpieza y desinfección para áreas generales de hospitales, clínicas y consultorios."
      gradienteHero="linear-gradient(135deg, rgba(0,174,239,0.14), rgba(2,116,197,0.10) 60%, rgba(255,255,255,0.6))"
      beneficios={[
        { icon: "desinfeccion", titulo: "Desinfección con respaldo", descripcion: "Fórmulas seleccionadas con retos microbianos y virucidas para procesos de higiene profesional." },
        { icon: "camilla", titulo: "Áreas críticas", descripcion: "Fórmulas específicas funcionales para la demanda de estos segmentos." },
        { icon: "documentos", titulo: "Soporte documental", descripcion: "Fichas técnicas, hojas de seguridad y registros aplicables para apoyar procesos internos de control." },
        { icon: "botella", titulo: "Higiene de uso diario", descripcion: "Productos para apoyar rutinas constantes de limpieza e higiene." },
      ]}
    />
  );
}
