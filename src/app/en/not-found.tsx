import type { Metadata } from "next"
import { NotFoundView } from "@/components/system/NotFoundView"
import { getSystem } from "@/i18n/content/system"

export const metadata: Metadata = { title: getSystem("en").notFound.title }

export default function NotFound() {
  return <NotFoundView locale="en" />
}
