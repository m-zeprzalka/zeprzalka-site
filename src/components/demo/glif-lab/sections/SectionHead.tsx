import type { SectionId } from "../lab/config"
import { VariantTag } from "../lab/VariantTag"
import { DecodeText } from "../text/DecodeText"

/**
 * Nagłówek sekcji: tytuł dekodowany glifami wariantu sekcji, obok (desktop)
 * albo pod nim (telefon) zdanie wprowadzenia, nad nim podpis wariantu.
 */
export function SectionHead({
  id,
  section,
  title,
  lead,
}: {
  id: string
  section: SectionId
  title: string
  lead: string
}) {
  return (
    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-6">
        <VariantTag section={section} className="-ms-1 mb-5" />
        <DecodeText
          as="h2"
          id={`${id}-title`}
          text={title}
          section={section}
          className="gll-h2"
          duration={0.7}
        />
      </div>
      <p className="max-w-[26rem] text-fm-lead text-pretty text-fm-ink-2 lg:col-span-6 lg:pb-1.5">
        {lead}
      </p>
    </div>
  )
}
