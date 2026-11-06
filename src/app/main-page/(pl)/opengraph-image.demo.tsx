import { OG_SIZE, pageOgImage } from "@/lib/og"

/** Karta strony głównej — ta sama fabryka co w serwisie (po przepięciu: `src/app/(pl)/opengraph-image.tsx`). */
const og = pageOgImage("pl", "home")

export const alt = og.alt
export const size = OG_SIZE
export const contentType = "image/png"
export default og.Image
