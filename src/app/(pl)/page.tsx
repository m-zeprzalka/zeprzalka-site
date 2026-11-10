import type { Metadata } from "next"
import { HomePage } from "@/components/views/home-page"
import { homeMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = homeMetadata("pl")

export default function Home() {
  return <HomePage locale="pl" />
}
