import type { Metadata } from "next"
import { ServicesPage } from "@/components/views/services-page"
import { servicesMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = servicesMetadata("pl")

export default function UslugiPage() {
  return <ServicesPage locale="pl" />
}
