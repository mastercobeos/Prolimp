import { writeFile, mkdir } from 'node:fs/promises';
import { extname, basename } from 'node:path';

const images = [
  // logo
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/08/ProlimpLogo-268x80-1.png', out: 'logo/prolimp-logo.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2021/11/prolimp-logo-2020.png', out: 'logo/prolimp-logo-2020.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/08/ISO_LOGO-bien-150x150.png', out: 'logo/iso-9001.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/ISO9001_LOGO-150x150.png', out: 'logo/iso-9001-alt.png' },
  // hero + banners
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/12/Imagen-portada-Catalogo-Prolimp.png', out: 'hero/portada-catalogo.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/Banner-SIBA2023-1536x601.jpg', out: 'hero/banner-siba.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/11/Banner-SIBA2023_movil.jpg', out: 'hero/banner-siba-mobile.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/08/Bannner-Blog.jpg', out: 'hero/banner-blog.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/11/1-Bannner%20Blog_movil.png', out: 'hero/banner-blog-mobile.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/08/Cintillo-Proxter.jpg', out: 'hero/cintillo-proxter.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/11/Cintillo-Proxter-movil-1.jpg', out: 'hero/cintillo-proxter-mobile.jpg' },
  // 12 lineas
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/automotriz.jpg', out: 'lineas/automotriz.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/Banos.jpg', out: 'lineas/banos.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/Especializados.jpg', out: 'lineas/especializados.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/Higiene.jpg', out: 'lineas/higiene.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/Industria.jpg', out: 'lineas/industrial.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/12/plec-categoria.jpg', out: 'lineas/plec.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/Albercas.jpg', out: 'lineas/albercas.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/cocinas.jpg', out: 'lineas/cocina.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/aromas.jpg', out: 'lineas/control-aromas.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/Pisos.jpg', out: 'lineas/pisos.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/Lavanderia.jpg', out: 'lineas/lavanderia.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/Aseo-general.jpg', out: 'lineas/aseo-general.jpg' },
  // marcas
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/prolimp-marcas-300x300.jpg', out: 'marcas/prolimp.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/Rubbermaid-marcas-300x300.jpg', out: 'marcas/rubbermaid.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/SCF-marcas-300x300.jpg', out: 'marcas/scf.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/wiese-marcas-300x300.jpg', out: 'marcas/wiese.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/3m-marcas-300x300.jpg', out: 'marcas/3m.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/castor-marcas-300x300.jpg', out: 'marcas/castor.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/09/kimberly-marcas-300x300.jpg', out: 'marcas/kimberly-clark.jpg' },
  // categorias grandes
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/08/quimicos-300x300.jpg', out: 'categorias/quimicos.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/08/papel-300x300.jpg', out: 'categorias/higienicos.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/08/despachadores-300x300.jpg', out: 'categorias/dosificadores.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/08/varios-300x300.jpg', out: 'categorias/varios.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/08/seguridad-300x300.jpg', out: 'categorias/seguridad.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/08/detergente-300x300.jpg', out: 'categorias/detergentes.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/08/jarceria-300x300.jpg', out: 'categorias/jarceria.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/08/plasticos-300x300.jpg', out: 'categorias/plasticos-desechables.jpg' },
  // nosotros
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/Banner_Nosotros_Fabricantes-1536x384.jpg', out: 'nosotros/banner-fabricantes.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/11/Banner_Fabricantes_movil.jpg', out: 'nosotros/banner-fabricantes-mobile.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/MarcasReconocidas.jpg', out: 'nosotros/marcas-reconocidas.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/11/colaboradores_Movil.png', out: 'nosotros/colaboradores.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/ESR.jpg', out: 'nosotros/esr.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/11/banner_ESRMundo_movil.png', out: 'nosotros/esr-mundo.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/LaDiferencia1-463x348.jpg', out: 'nosotros/diferencia-1.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/LaDiferencia2-463x348.jpg', out: 'nosotros/diferencia-2.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/Ecologicos.png', out: 'nosotros/ecologicos.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/economicos.png', out: 'nosotros/economicos.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/especializados.png', out: 'nosotros/especializados-icon.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/chica_Limpieza.png', out: 'nosotros/chica-limpieza.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/11/chica_Limpieza-Movil.png', out: 'nosotros/chica-limpieza-mobile.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/stps-1024x222.jpg', out: 'nosotros/stps.jpg' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/11/Banner-constancia-DC3-2.png', out: 'nosotros/constancia-dc3.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/02HojaSeguridad.png', out: 'nosotros/hoja-seguridad.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/01Manuales.png', out: 'nosotros/manuales.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/03FichaTecnica.png', out: 'nosotros/ficha-tecnica.png' },
  { url: 'https://www.prolimp.com/wp-content/uploads/2023/10/04AyudaVisual.png', out: 'nosotros/ayuda-visual.png' },
];

const outRoot = '../web/public/originals';
const uaHeaders = { 'user-agent': 'Mozilla/5.0 (Prolimp asset migration)' };

let ok = 0, fail = 0;
await Promise.all(images.map(async ({ url, out }) => {
  try {
    const res = await fetch(url, { headers: uaHeaders });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const path = `${outRoot}/${out}`;
    await mkdir(path.substring(0, path.lastIndexOf('/')), { recursive: true });
    await writeFile(path, buf);
    console.log('OK', out, `${(buf.length / 1024).toFixed(0)}KB`);
    ok++;
  } catch (e) {
    console.error('FAIL', out, e.message);
    fail++;
  }
}));
console.log(`\nDone. ${ok} downloaded, ${fail} failed.`);
