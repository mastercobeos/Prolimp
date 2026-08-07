import { Hero } from "@/components/home/Hero";
import { Diferenciadores } from "@/components/home/Diferenciadores";
import { Lineas } from "@/components/home/Lineas";
import { Categorias } from "@/components/home/Categorias";
import { Marcas } from "@/components/home/Marcas";
import { BlogPreview } from "@/components/home/BlogPreview";
import { HechoEnMexico } from "@/components/home/HechoEnMexico";
import { CtaBand } from "@/components/shared/CtaBand";
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
      <Lineas lineas={lineas} />
      <Diferenciadores items={home.diferenciadores} />
      <CtaBand
        titulo="Los baños de tu empresa sin mal olor"
        href="https://controldeolores-siba.com"
        external
        variant="azul"
        logo={{ src: "/img/redesign/siba-logo.png", alt: "SIBA · Sistema para baños Prolimp", width: 149, height: 69 }}
      />
      <Categorias categorias={categorias} />
      <Marcas marcas={marcas} />
      <CtaBand
        titulo="Protegemos tu empresa y hogar de la invasión de plagas"
        href="/contacto"
        variant="proxter"
        logo={{ src: "/img/redesign/proxter-logo-blanco.png", alt: "Proxter · Ecoservicio de control de plagas", width: 149, height: 115 }}
      />
      <BlogPreview posts={posts} />
      <HechoEnMexico />
    </>
  );
}
