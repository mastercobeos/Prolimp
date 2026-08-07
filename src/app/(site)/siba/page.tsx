import { redirect } from "next/navigation";

// El sitio de SIBA vive fuera de Prolimp. Cualquier hit a /siba redirige.
export default function SibaPage() {
  redirect("https://controldeolores-siba.com");
}
