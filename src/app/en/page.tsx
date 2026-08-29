import type { Metadata } from "next"
import { HomeView } from "@/components/views/HomeView"
import { pageAlternates } from "@/i18n/metadata"

export const metadata: Metadata = {
  alternates: pageAlternates("en", "home"),
}

export default function Home() {
  return <HomeView locale="en" />
}
