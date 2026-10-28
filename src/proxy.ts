import { NextResponse } from "next/server";

// Páginas de spam de casino que inyectaron en el WordPress hackeado. Google aún
// las tiene indexadas; un 410 (Gone) le dice que no van a volver y las retira
// antes que un 404. El matcher limita el proxy a esas rutas: el resto del sitio
// no pasa por aquí.
export function proxy() {
  return new NextResponse(null, { status: 410 });
}

export const config = {
  matcher:
    "/:spam([^/]*(?:casino|casin[ao]|kasyn|kasin|slot|jackpot|bingo|vegas|gambl|poker|roulette|blackjack|betting|bonus|spins)[^/]*)",
};
