import type { Metadata } from "next"
import { CategoriesPage } from "@/app/main-page/_components/views/categories-page"
import { preview } from "@/app/main-page/_lib/metadata"
import { categoriesMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = preview(categoriesMetadata("pl"))

/** Po przepięciu: `src/app/(pl)/blog/kategoria/page.tsx`. */
export default function Page() {
  return <CategoriesPage locale="pl" />
}
