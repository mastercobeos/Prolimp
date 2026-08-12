// Procesa el sello Kosher a partir del arte limpio que entregó el cliente
// (public/img/redesign/_original/kosher-cliente.webp, 270x270 sin alfa).
//
// Es arte plano de bordes limpios, muy superior al PNG de 150x101 que se había
// scrapeado de Canva, así que aquí NO se usa Real-ESRGAN: basta recortar el
// margen, escalar con lanczos y recuperar la transparencia.
//
// La transparencia se saca con relleno por inundación desde los bordes, NO
// recortando por color: el sello tiene blanco DENTRO (el anillo y las letras
// "KMD"/"MÉXICO"), y recortar por color se los comería.
//
// Uso: node scripts/procesar-sello-kosher.mjs

import { existsSync } from "node:fs";
import sharp from "sharp";

const ORIGEN = "./public/img/redesign/_original/kosher-cliente.webp";
const DESTINO = "./public/img/redesign/sello-kosher.webp";
const ANCHO = 900; // ~2x de lo que pide retina (el sello se ve a 227 CSS)
const UMBRAL_BLANCO = 225; // por encima de esto se considera fondo

if (!existsSync(ORIGEN)) {
  console.error(`No existe ${ORIGEN}`);
  process.exit(1);
}

// 1) Recortar el margen blanco y escalar.
const escalado = await sharp(ORIGEN)
  .trim({ threshold: 8 })
  .resize({ width: ANCHO, kernel: "lanczos3" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { data, info } = escalado;
const { width: w, height: h } = info;

// 2) Relleno por inundación desde los bordes sobre los píxeles casi blancos.
const fuera = new Uint8Array(w * h);
const pila = [];
const esBlanco = (p) => {
  const i = p * 4;
  return Math.min(data[i], data[i + 1], data[i + 2]) >= UMBRAL_BLANCO;
};
for (let x = 0; x < w; x++) {
  pila.push(x, (h - 1) * w + x);
}
for (let y = 0; y < h; y++) {
  pila.push(y * w, y * w + w - 1);
}
while (pila.length) {
  const p = pila.pop();
  if (fuera[p] || !esBlanco(p)) continue;
  fuera[p] = 1;
  const x = p % w;
  const y = (p - x) / w;
  if (x > 0) pila.push(p - 1);
  if (x < w - 1) pila.push(p + 1);
  if (y > 0) pila.push(p - w);
  if (y < h - 1) pila.push(p + w);
}

// 3) Alfa: fuera transparente; en el borde, proporcional a lo blanco que sea,
//    para que el contorno no quede dentado.
let transparentes = 0;
for (let p = 0; p < w * h; p++) {
  const i = p * 4;
  if (fuera[p]) {
    data[i + 3] = 0;
    transparentes++;
    continue;
  }
  const min = Math.min(data[i], data[i + 1], data[i + 2]);
  let vecinoFuera = false;
  const x = p % w;
  const y = (p - x) / w;
  if (x > 0 && fuera[p - 1]) vecinoFuera = true;
  else if (x < w - 1 && fuera[p + 1]) vecinoFuera = true;
  else if (y > 0 && fuera[p - w]) vecinoFuera = true;
  else if (y < h - 1 && fuera[p + w]) vecinoFuera = true;
  if (vecinoFuera && min > 200) {
    data[i + 3] = Math.round(255 * (1 - (min - 200) / (UMBRAL_BLANCO - 200 + 1)));
  }
}

await sharp(data, { raw: { width: w, height: h, channels: 4 } })
  .webp({ quality: 92, effort: 6, alphaQuality: 100 })
  .toFile(DESTINO);

const m = await sharp(DESTINO).metadata();
const kb = Math.round((await sharp(DESTINO).toBuffer()).length / 1024);
console.log(`✓ ${DESTINO} — ${m.width}x${m.height}, alfa=${m.hasAlpha}, ${kb}KB`);
console.log(`  fondo transparente: ${((transparentes / (w * h)) * 100).toFixed(0)}% del lienzo`);
