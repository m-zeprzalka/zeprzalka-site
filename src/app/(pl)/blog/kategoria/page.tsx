import type { Metadata } from "next"
import { CategoriesPage } from "@/components/views/categories-page"
import { categoriesMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = categoriesMetadata("pl")

export default function CategoryIndexPage() {
  return <CategoriesPage locale="pl" />
}
