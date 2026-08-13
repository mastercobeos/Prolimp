import type { SchemaTypeDefinition } from "sanity";
import { categoria } from "./categoria";
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

export const schemaTypes: SchemaTypeDefinition[] = [
  home,
  empresa,
  sistemasDilucion,
  producto,
  categoria,
  linea,
  marca,
  sucursal,
  post,
  catalogo,
  suscripcion,
  tabla,
];
