import type { Metadata } from "next"
import { AboutView } from "@/components/views/AboutView"
import { aboutMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = aboutMetadata("pl")

export default function CVPage() {
  return <AboutView locale="pl" />
}
