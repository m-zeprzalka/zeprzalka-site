import type { Metadata } from "next"
import { AboutView } from "@/components/views/AboutView"
import { aboutMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = aboutMetadata("en")

export default function AboutPage() {
  return <AboutView locale="en" />
}
