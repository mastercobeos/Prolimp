"use client";

import { useState } from "react";
import clsx from "clsx";
import s from "./menus.module.css";

const items = ["Inicio", "Nosotros", "Productos", "Contacto"];

function Panel({ variant, on }: { variant: string; on: boolean }) {
  const commonLinks = items.map((i) => (
    <a key={i} href="#" onClick={(e) => e.preventDefault()}>{i}</a>
  ));
  return (
    <>
      {variant === "drawer" && <div className={clsx(s.pDrawer, on && s.on)}>{commonLinks}</div>}
      {variant === "drawerLeft" && <div className={clsx(s.pDrawerLeft, on && s.on)}>{commonLinks}</div>}
      {variant === "full" && <div className={clsx(s.pFull, on && s.on)}>{commonLinks}</div>}
      {variant === "curtain" && <div className={clsx(s.pCurtain, on && s.on)}>{commonLinks}</div>}
      {variant === "bottom" && <div className={clsx(s.pBottom, on && s.on)}>{commonLinks}</div>}
      {variant === "pop" && <div className={clsx(s.pPop, on && s.on)}>{commonLinks}</div>}
      {variant === "radial" && <div className={clsx(s.pRadial, on && s.on)}>{commonLinks}</div>}
      {variant === "split" && (
        <>
          <div className={clsx(s.pSplitTop, on && s.on)}>{items.slice(0, 2).map((i) => <a key={i} href="#" onClick={(e) => e.preventDefault()}>{i}</a>)}</div>
          <div className={clsx(s.pSplitBot, on && s.on)}>{items.slice(2).map((i) => <a key={i} href="#" onClick={(e) => e.preventDefault()}>{i}</a>)}</div>
        </>
      )}
      {variant === "diagonal" && <div className={clsx(s.pDiagonal, on && s.on)}>{commonLinks}</div>}
      {variant === "glass" && <div className={clsx(s.pGlass, on && s.on)}>{commonLinks}</div>}
      {variant === "blob" && <div className={clsx(s.pBlob, on && s.on)}>{commonLinks}</div>}
    </>
  );
}

type Demo = {
  n: string;
  label: string;
  burgerClass: string;
  panel: string;
  render?: (open: boolean) => React.ReactNode;
};

const demos: Demo[] = [
  { n: "01", label: "3 líneas → X (clásico)", burgerClass: s.b01, panel: "drawer",
    render: (o) => <><span/><span/><span/></> },
  { n: "02", label: "3 puntos → X", burgerClass: s.b02, panel: "pop",
    render: () => <><span/><span/><span/></> },
  { n: "03", label: "3 barras gruesas → X", burgerClass: s.b03, panel: "drawer",
    render: () => <><span/><span/><span/></> },
  { n: "04", label: "Plus rotando → X", burgerClass: s.b04, panel: "pop",
    render: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    ) },
  { n: "05", label: "Líneas → flecha derecha", burgerClass: s.b05, panel: "drawer",
    render: () => <><span/><span/><span/></> },
  { n: "06", label: "Merge morph", burgerClass: s.b06, panel: "curtain",
    render: () => <><span/><span/><span/></> },
  { n: "07", label: "Elastic bounce", burgerClass: s.b07, panel: "pop",
    render: () => <><span/><span/><span/></> },
  { n: "08", label: "Bento 9 puntos → X", burgerClass: s.b08, panel: "glass",
    render: () => <><span/><span/><span/><span/><span/><span/><span/><span/><span/></> },
  { n: "09", label: "3 puntos verticales", burgerClass: s.b09, panel: "pop",
    render: () => <><span/><span/><span/></> },
  { n: "10", label: "Hexágono", burgerClass: s.b10, panel: "drawer",
    render: () => <><span/><span/><span/></> },
  { n: "11", label: "Círculo", burgerClass: s.b11, panel: "radial",
    render: () => <><span/><span/><span/></> },
  { n: "12", label: "Pastillas apiladas", burgerClass: s.b12, panel: "drawer",
    render: () => <><span/><span/><span/></> },
  { n: "13", label: "Líneas asimétricas", burgerClass: s.b13, panel: "pop",
    render: () => <><span/><span/><span/></> },
  { n: "14", label: "Waffle (6 puntos)", burgerClass: s.b14, panel: "glass",
    render: () => <><span/><span/><span/><span/><span/><span/></> },
  { n: "15", label: "Chevron abajo", burgerClass: s.b15, panel: "curtain",
    render: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    ) },
  { n: "16", label: "Cubo 3D girando", burgerClass: s.b16, panel: "full",
    render: () => (
      <div className={s.inner}>
        <div className={s.face}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </div>
        <div className={clsx(s.face, s.back)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </div>
      </div>
    ) },
  { n: "17", label: "Barras horizontales → X", burgerClass: s.b17, panel: "split",
    render: () => <><div className={s.top}/><div className={s.bot}/></> },
  { n: "18", label: "Cortina superior", burgerClass: s.b18, panel: "curtain",
    render: () => <><span/><span/><span/></> },
  { n: "19", label: "Overlay fullscreen", burgerClass: s.b19, panel: "full",
    render: () => <><span/><span/><span/></> },
  { n: "20", label: "Pop radial (clip)", burgerClass: s.b20, panel: "radial",
    render: () => <><span/><span/><span/></> },
  { n: "21", label: "Drawer izquierdo", burgerClass: s.b21, panel: "drawerLeft",
    render: () => <><span/><span/><span/></> },
  { n: "22", label: "Bottom sheet", burgerClass: s.b22, panel: "bottom",
    render: () => <><span/><span/><span/></> },
  { n: "23", label: "Diagonal reveal", burgerClass: s.b23, panel: "diagonal",
    render: () => <><span/><span/><span/></> },
  { n: "24", label: "Icono lateral", burgerClass: s.b24, panel: "drawer",
    render: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <path d="M9 4v16"/>
      </svg>
    ) },
  { n: "25", label: "Blob refractivo", burgerClass: s.b25, panel: "blob",
    render: () => (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c5 0 10 3 10 8s-3 12-10 12S2 15 2 10 7 2 12 2z"/>
      </svg>
    ) },
];

function Card({ demo }: { demo: Demo }) {
  const [open, setOpen] = useState(false);
  const showBackdrop = ["drawer", "drawerLeft", "bottom"].includes(demo.panel);
  return (
    <div className={s.card}>
      <div className={s.stage}>
        {showBackdrop && <div className={clsx(s.backdrop, open && s.on)} onClick={() => setOpen(false)} />}
        <Panel variant={demo.panel} on={open} />
        <div className={s.burgerSlot}>
          <button
            className={clsx(s.burger, demo.burgerClass, open && s.open)}
            style={{ position: "relative" }}
            onClick={() => setOpen(!open)}
            aria-label={open ? "Cerrar" : "Abrir"}
            aria-expanded={open}
          >
            {demo.render?.(open)}
          </button>
        </div>
      </div>
      <div className={s.label}>
        <span className={s.labelNum}>{demo.n}</span>
        {demo.label}
      </div>
    </div>
  );
}

export default function MenusLabPage() {
  return (
    <div className={s.page}>
      <div className={s.header}>
        <h1 className={s.title}>Lab · Menús hamburguesa</h1>
        <p className={s.subtitle}>
          25 variantes de burger + panel. Haz click en cada botón para probar la animación y el estilo de apertura.
        </p>
      </div>
      <div className={s.grid}>
        {demos.map((d) => <Card key={d.n} demo={d} />)}
      </div>
    </div>
  );
}
