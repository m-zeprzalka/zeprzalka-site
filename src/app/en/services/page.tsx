import type { Metadata } from "next"
import { ServicesView } from "@/components/views/ServicesView"
import { servicesMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = servicesMetadata("en")

export default function ServicesPage() {
  return <ServicesView locale="en" />
}
