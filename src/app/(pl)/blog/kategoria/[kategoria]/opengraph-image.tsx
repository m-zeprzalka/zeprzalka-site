import { OG_SIZE, categoryOgImage } from "@/lib/og"

const og = categoryOgImage("pl", "kategoria")

export const alt = og.alt
export const size = OG_SIZE
export const contentType = "image/png"
export const dynamicParams = false
export const generateStaticParams = og.generateStaticParams
export default og.Image
