import type { Metadata } from "next"
import { ContactView } from "@/components/views/ContactView"
import { contactMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = contactMetadata("en")

export default function ContactPage() {
  return <ContactView locale="en" />
}
