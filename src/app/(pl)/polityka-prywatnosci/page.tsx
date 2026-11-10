import type { Metadata } from "next"
import { PrivacyPage } from "@/components/views/privacy-page"
import { privacyMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = privacyMetadata("pl")

export default function Page() {
  return <PrivacyPage locale="pl" />
}
