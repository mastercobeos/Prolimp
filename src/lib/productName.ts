// Divide "Anticoch´s Gel. Quita cochambre en gel" → título + subtítulo (lámina 12/13).
// Segmentos cortos o tipo código ("AD", "S.E-I") se quedan en el título.
export function splitNombreProducto(nombre: string): { titulo: string; subtitulo?: string } {
  const segmentos = nombre.split(/\.\s+/);
  if (segmentos.length < 2) return { titulo: nombre };

  const tituloPartes = [segmentos[0]];
  let i = 1;
  while (i < segmentos.length - 1 && (segmentos[i].length <= 8 || /^[A-Z0-9.\-´’'&\s]{1,10}$/.test(segmentos[i]))) {
    tituloPartes.push(segmentos[i]);
    i++;
  }
  const subtitulo = segmentos.slice(i).join(". ");
  if (!subtitulo) return { titulo: nombre };
  return { titulo: `${tituloPartes.join(". ")}.`, subtitulo };
}
