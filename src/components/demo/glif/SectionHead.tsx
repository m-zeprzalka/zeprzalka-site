import { DecodeText } from "./DecodeText"

/**
 * Nagłówek sekcji: duży tytuł dekodowany z glifów, obok (desktop) albo pod nim
 * (telefon) zdanie wprowadzenia.
 */
export function SectionHead({ id, title, lead }: { id: string; title: string; lead: string }) {
  return (
    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-12 lg:items-end">
      <DecodeText as="h2" id={`${id}-title`} text={title} className="gl-h2 lg:col-span-6" />
      <p className="max-w-[26rem] text-fm-lead text-pretty text-fm-ink-2 lg:col-span-6 lg:pb-1.5">
        {lead}
      </p>
    </div>
  )
}
