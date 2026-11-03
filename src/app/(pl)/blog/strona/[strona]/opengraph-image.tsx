import { OG_SIZE, archiveOgImage } from "@/lib/og"

const og = archiveOgImage("pl", "strona")

export const alt = og.alt
export const size = OG_SIZE
export const contentType = "image/png"
export const dynamicParams = false
export const generateStaticParams = og.generateStaticParams
export default og.Image
