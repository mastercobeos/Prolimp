import { Hero } from "@/components/home/Hero";
import { Diferenciadores } from "@/components/home/Diferenciadores";
import { Lineas } from "@/components/home/Lineas";
import { Categorias } from "@/components/home/Categorias";
import { Marcas } from "@/components/home/Marcas";
import { BlogPreview } from "@/components/home/BlogPreview";
import { CtaCierre } from "@/components/home/CtaCierre";
import { getHomeContent, getLineas, getCategorias, getMarcas, getPosts } from "@/lib/data";

export default async function Home() {
  const [home, lineas, categorias, marcas, posts] = await Promise.all([
    getHomeContent(),
    getLineas(),
    getCategorias(),
    getMarcas(),
    getPosts(),
  ]);

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
      <Diferenciadores items={home.diferenciadores} />
      <Lineas lineas={lineas} />
      <Categorias categorias={categorias} />
      <Marcas marcas={marcas} />
      <BlogPreview posts={posts} />
      <CtaCierre titulo={home.ctaCierreTitulo} lede={home.ctaCierreLede} />
    </>
  );
}
