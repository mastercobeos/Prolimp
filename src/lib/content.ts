// Contenido curado desde prolimp.com — se migrará a Sanity en la siguiente fase.

export const empresa = {
  nombre: "Prolimp",
  nombreLegal: "Prolimp del Centro",
  tagline: "Fabricantes de químicos y productos de limpieza profesional",
  descripcion:
    "Fabricamos una extensa línea de productos químicos de gran calidad marca propia Prolimp® para limpieza industrial, comercial y de hogar. Además distribuimos las herramientas necesarias para llevar a cabo todos los procesos de limpieza.",
  fundacion: "1971",
  whatsapp: "5212291406981",
  whatsappDisplay: "+52 1 229 140 6981",
  email: "contacto@prolimp.com",
  facebook: "https://www.facebook.com/prolimpdelcentro",
  instagram: "https://www.instagram.com/prolimp1",
  linkedin: "https://www.linkedin.com/company/prolimp-del-centro",
  youtube: "https://www.youtube.com/prolimp1",
  copyright: `Prolimp del Centro. © ${new Date().getFullYear()}. Todos los derechos reservados.`,
};

export type Linea = {
  slug: string;
  nombre: string;
  descripcion: string;
  image: string;
};

// Las 11 líneas de químicos propios Prolimp
export const lineas: Linea[] = [
  { slug: "automotriz", nombre: "Automotriz", descripcion: "Champús, ceras, desengrasantes y limpiadores especializados para vehículos y talleres.", image: "/img/lineas/automotriz.webp" },
  { slug: "banos", nombre: "Baños", descripcion: "Desincrustantes, aromatizantes y limpiadores diseñados para sanitarios de alto tráfico.", image: "/img/lineas/banos.webp" },
  { slug: "especializados", nombre: "Especializados", descripcion: "Fórmulas técnicas para problemas específicos y superficies delicadas.", image: "/img/lineas/especializados.webp" },
  { slug: "higiene", nombre: "Higiene", descripcion: "Desinfectantes con retos microbianos y virucidas para ambientes críticos.", image: "/img/lineas/higiene.webp" },
  { slug: "industrial", nombre: "Industrial", descripcion: "Desengrasantes de alta concentración para planta, taller y maquinaria pesada.", image: "/img/lineas/industrial.webp" },
  { slug: "plec", nombre: "PLEC", descripcion: "Productos de limpieza para la industria de alimentos y áreas de proceso.", image: "/img/lineas/plec.webp" },
  { slug: "albercas", nombre: "Albercas", descripcion: "Cloro, algicidas y clarificadores para el mantenimiento profesional de albercas.", image: "/img/lineas/albercas.webp" },
  { slug: "cocina", nombre: "Cocina", descripcion: "Desengrasantes, sanitizantes y lavaloza para cocinas industriales.", image: "/img/lineas/cocina.webp" },
  { slug: "control-aromas", nombre: "Control de aromas", descripcion: "Aromatizantes ambientales y bloqueadores de olor de larga duración.", image: "/img/lineas/control-aromas.webp" },
  { slug: "pisos", nombre: "Pisos", descripcion: "Selladores, ceras y limpiadores para cada tipo de superficie.", image: "/img/lineas/pisos.webp" },
  { slug: "lavanderia", nombre: "Lavandería", descripcion: "Detergentes, blanqueadores y suavizantes para lavandería institucional.", image: "/img/lineas/lavanderia.webp" },
  { slug: "aseo-general", nombre: "Aseo General", descripcion: "Limpiadores multiusos, desinfectantes y aromatizantes de uso diario.", image: "/img/lineas/aseo-general.webp" },
];

export type Categoria = {
  slug: string;
  nombre: string;
  descripcion: string;
  image: string;
  destacada?: boolean;
};

export const categorias: Categoria[] = [
  { slug: "quimicos", nombre: "Químicos", descripcion: "Nuestras 11 líneas de químicos de fabricación propia.", image: "/img/categorias/quimicos.webp", destacada: true },
  { slug: "higienicos", nombre: "Higiénicos", descripcion: "Papel higiénico, pañuelos, servilletas y toallas.", image: "/img/categorias/higienicos.webp", destacada: true },
  { slug: "dosificadores", nombre: "Dosificadores", descripcion: "Despachadores de jabón, aromas, papel y toallas.", image: "/img/categorias/dosificadores.webp", destacada: true },
  { slug: "jarceria", nombre: "Jarciería", descripcion: "Escobas, trapeadores, cepillos, atomizadores, cubetas y más.", image: "/img/categorias/jarceria.webp", destacada: true },
  { slug: "detergentes", nombre: "Detergentes", descripcion: "Detergentes de tocador, hotelero y lavandería.", image: "/img/categorias/detergentes.webp" },
  { slug: "seguridad", nombre: "Seguridad", descripcion: "Cubrebocas, guantes, cofias y equipo de protección.", image: "/img/categorias/seguridad.webp" },
  { slug: "plasticos-desechables", nombre: "Plásticos y desechables", descripcion: "Bolsas, aluminio, cubiertos y desechables.", image: "/img/categorias/plasticos-desechables.webp" },
  { slug: "varios", nombre: "Varios", descripcion: "Botes de basura, carritos de limpieza y accesorios.", image: "/img/categorias/varios.webp" },
];

export type Marca = {
  slug: string;
  nombre: string;
  image: string;
  productos: number;
};

export const marcas: Marca[] = [
  { slug: "prolimp", nombre: "Prolimp", image: "/img/marcas/prolimp.webp", productos: 62 },
  { slug: "rubbermaid", nombre: "Rubbermaid", image: "/img/marcas/rubbermaid.webp", productos: 2 },
  { slug: "scf", nombre: "SCF", image: "/img/marcas/scf.webp", productos: 4 },
  { slug: "wiese", nombre: "Wiese", image: "/img/marcas/wiese.webp", productos: 14 },
  { slug: "3m", nombre: "3M", image: "/img/marcas/3m.webp", productos: 4 },
  { slug: "castor", nombre: "Castor", image: "/img/marcas/castor.webp", productos: 43 },
  { slug: "kimberly-clark", nombre: "Kimberly-Clark", image: "/img/marcas/kimberly-clark.webp", productos: 48 },
];

export type Diferenciador = {
  titulo: string;
  descripcion: string;
  icon: string;
};

export const diferenciadores: Diferenciador[] = [
  {
    titulo: "Ecológicos",
    descripcion:
      "Certificados de biodegradabilidad que garantizan la protección al medio ambiente en cada uso.",
    icon: "/img/nosotros/ecologicos.webp",
  },
  {
    titulo: "Económicos",
    descripcion:
      "Por su alta concentración, con menos producto se logra mayor limpieza. Menor costo por metro cuadrado.",
    icon: "/img/nosotros/economicos.webp",
  },
  {
    titulo: "Especializados",
    descripcion:
      "Un limpiador para cada necesidad. Fórmulas específicas según el tipo de suciedad y superficie.",
    icon: "/img/nosotros/especializados-icon.webp",
  },
];

export type Sucursal = {
  ciudad: string;
  estado: string;
  telefono?: string;
  direccion?: string;
};

// Sucursales principales — se ajustará con la data del cliente al conectar Sanity.
export const sucursales: Sucursal[] = [
  { ciudad: "Xalapa", estado: "Veracruz" },
  { ciudad: "Veracruz", estado: "Veracruz" },
  { ciudad: "Coatzacoalcos", estado: "Veracruz" },
  { ciudad: "Ciudad de México", estado: "CDMX" },
  { ciudad: "Puebla", estado: "Puebla" },
  { ciudad: "Villahermosa", estado: "Tabasco" },
];
