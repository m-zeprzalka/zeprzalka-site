import type { Metadata } from "next"
import { ContactPage } from "@/components/views/contact-page"
import { contactMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = contactMetadata("pl")

export default function KontaktPage() {
  return <ContactPage locale="pl" />
}
