import type { Metadata } from "next"
import { ContactPage } from "@/app/main-page/_components/views/contact-page"
import { preview } from "@/app/main-page/_lib/metadata"
import { contactMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = preview(contactMetadata("pl"))

/** Po przepięciu: `src/app/(pl)/kontakt/page.tsx`. */
export default function Page() {
  return <ContactPage locale="pl" />
}
