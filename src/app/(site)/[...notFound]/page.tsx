import { notFound } from "next/navigation";

// Catch-all: any URL that no other (site) route matches renders the styled
// not-found page WITH the site header/footer (defined routes take precedence).
export default function CatchAll() {
  notFound();
}
