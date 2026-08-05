import { Hero } from "@/components/home/Hero";
import { DestacadosSlider } from "@/components/home/DestacadosSlider";
import { Diferenciadores } from "@/components/home/Diferenciadores";
import { Lineas } from "@/components/home/Lineas";
import { Categorias } from "@/components/home/Categorias";
import { Marcas } from "@/components/home/Marcas";
import { BlogPreview } from "@/components/home/BlogPreview";
import { CtaCierre } from "@/components/home/CtaCierre";
import { getHomeContent, getLineas, getCategorias, getMarcas, getPosts, getEmpresa, getProductosDestacados } from "@/lib/data";
import { urlForImage } from "@/sanity/image";

export default async function Home() {
  const [home, lineas, categorias, marcas, posts, empresa, destacados] = await Promise.all([
    getHomeContent(),
    getLineas(),
    getCategorias(),
    getMarcas(),
    getPosts(),
    getEmpresa(),
    getProductosDestacados(),
  ]);

  const destacadosNormalizados = destacados.map((p) => ({
    _id: p._id,
    nombre: p.nombre,
    slug: p.slug,
    sku: p.sku,
    descripcionCorta: p.descripcionCorta,
    marca: p.marca,
    categoria: p.categoria,
    imagen: p.imagenPrincipal ? urlForImage(p.imagenPrincipal).width(400).auto("format").url() : undefined,
  }));

  return (
    <>
      <Hero
        eyebrow={home.heroEyebrow}
        titulo1={home.heroTituloParte1}
        tituloAcento={home.heroTituloAcento}
        lede={home.heroLede}
        imagen={home.heroImagen}
        stats={home.stats}
      />
      <DestacadosSlider productos={destacadosNormalizados} />
      <Diferenciadores items={home.diferenciadores} />
      <Lineas lineas={lineas} />
      <Categorias categorias={categorias} />
      <Marcas marcas={marcas} />
      <BlogPreview posts={posts} />
      <CtaCierre titulo={home.ctaCierreTitulo} lede={home.ctaCierreLede} whatsapp={empresa.whatsapp} />
    </>
  );
}
