import type { Metadata } from "next"
import { HomeView } from "@/components/views/HomeView"
import { homeMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = homeMetadata("pl")

export default function Home() {
  return <HomeView locale="pl" />
}
