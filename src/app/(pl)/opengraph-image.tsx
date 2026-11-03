import { OG_SIZE, pageOgImage } from "@/lib/og"

/** Domyślna karta serwisu — także dla stron bez własnej. */
const og = pageOgImage("pl", "home")

export const alt = og.alt
export const size = OG_SIZE
export const contentType = "image/png"
export default og.Image
