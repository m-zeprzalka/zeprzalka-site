import type { Metadata } from "next"
import { CategoryIndexView } from "@/components/views/CategoryIndexView"
import { categoriesMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = categoriesMetadata("pl")

export default function CategoryIndexPage() {
  return <CategoryIndexView locale="pl" />
}
