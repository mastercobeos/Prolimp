import NextLink from "next/link";
import type { ComponentProps } from "react";

/** next/link with viewport prefetch off by default: every page view was prefetching ~25 routes. */
export default function Link({ prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch} {...props} />;
}
