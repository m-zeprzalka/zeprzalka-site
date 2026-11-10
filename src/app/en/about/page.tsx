import type { Metadata } from "next"
import { AboutPage } from "@/components/views/about-page"
import { aboutMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = aboutMetadata("en")

export default function Page() {
  return <AboutPage locale="en" />
}
