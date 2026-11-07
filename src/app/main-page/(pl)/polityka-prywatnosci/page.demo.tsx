import type { Metadata } from "next"
import { PrivacyPage } from "@/app/main-page/_components/views/privacy-page"
import { preview } from "@/app/main-page/_lib/metadata"
import { privacyMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = preview(privacyMetadata("pl"))

/** Po przepięciu: `src/app/(pl)/polityka-prywatnosci/page.tsx`. */
export default function Page() {
  return <PrivacyPage locale="pl" />
}
