import { OG_SIZE, tagOgImage } from "@/lib/og"

const og = tagOgImage("pl", "tag")

export const alt = og.alt
export const size = OG_SIZE
export const contentType = "image/png"
export const dynamicParams = false
export const generateStaticParams = og.generateStaticParams
export default og.Image
