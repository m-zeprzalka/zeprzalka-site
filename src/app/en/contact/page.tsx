import type { Metadata } from "next"
import { ContactPage } from "@/components/views/contact-page"
import { contactMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = contactMetadata("en")

export default function Page() {
  return <ContactPage locale="en" />
}
