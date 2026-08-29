import type { Metadata } from "next"
import { ServicesView } from "@/components/views/ServicesView"
import { servicesMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = servicesMetadata("pl")

export default function UslugiPage() {
  return <ServicesView locale="pl" />
}
