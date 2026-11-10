import type { Metadata } from "next"
import { ServicesPage } from "@/components/views/services-page"
import { servicesMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = servicesMetadata("en")

export default function Page() {
  return <ServicesPage locale="en" />
}
