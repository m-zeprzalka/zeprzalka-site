import type { Metadata } from "next"
import { HomeView } from "@/components/views/HomeView"
import { pageAlternates } from "@/i18n/metadata"

export const metadata: Metadata = {
  alternates: pageAlternates("pl", "home"),
}

export default function Home() {
  return <HomeView locale="pl" />
}
