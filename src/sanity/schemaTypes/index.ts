import type { SchemaTypeDefinition } from "sanity";
import { categoria } from "./categoria";
import { subcategoria } from "./subcategoria";
import { marca } from "./marca";
import { linea } from "./linea";
import { producto } from "./producto";
import { post } from "./post";
import { home } from "./home";
import { sucursal } from "./sucursal";
import { empresa } from "./empresa";
import { sistemasDilucion } from "./sistemasDilucion";
import { suscripcion } from "./suscripcion";
import { catalogo } from "./catalogo";
import { tabla } from "./tabla";
import { categoriaBlog } from "./categoriaBlog";

export const schemaTypes: SchemaTypeDefinition[] = [
  home,
  empresa,
  sistemasDilucion,
  producto,
  categoria,
  subcategoria,
  linea,
  marca,
  sucursal,
  post,
  categoriaBlog,
  catalogo,
  suscripcion,
  tabla,
];
