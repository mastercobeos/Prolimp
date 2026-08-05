export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing env: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing env: NEXT_PUBLIC_SANITY_DATASET",
);

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

// Server-only. NUNCA agregar NEXT_PUBLIC_ prefix.
export const writeToken = process.env.SANITY_API_WRITE_TOKEN;

export const studioUrl = "/studio";

function assertValue<T>(v: T | undefined, msg: string): T {
  if (v === undefined) throw new Error(msg);
  return v;
}
