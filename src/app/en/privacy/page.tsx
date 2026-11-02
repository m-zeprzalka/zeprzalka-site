import type { Metadata } from "next"
import { PrivacyView } from "@/components/views/PrivacyView"
import { privacyMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = privacyMetadata("en")

export default function PrivacyPage() {
  return <PrivacyView locale="en" />
}
