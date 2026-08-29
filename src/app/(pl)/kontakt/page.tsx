import type { Metadata } from "next"
import { ContactView } from "@/components/views/ContactView"
import { contactMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = contactMetadata("pl")

export default function KontaktPage() {
  return <ContactView locale="pl" />
}
