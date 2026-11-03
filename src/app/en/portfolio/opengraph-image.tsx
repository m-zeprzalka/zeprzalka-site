import { OG_SIZE, pageOgImage } from "@/lib/og"

const og = pageOgImage("en", "portfolio")

export const alt = og.alt
export const size = OG_SIZE
export const contentType = "image/png"
export default og.Image
