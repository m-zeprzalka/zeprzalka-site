"use client"

import { useStage } from "./store"

/**
 * Mały „Kontakt” w pasku (poniżej 1280 px): pojawia się, gdy wstęp z głównym
 * przyciskiem zniknie z kadru, i chowa się przy formularzu. Ukryty nie jest
 * fokusowalny (`visibility: hidden` po wyjściu, `aria-hidden`).
 */
export function BarContact({ label }: { label: string }) {
  const section = useStage((s) => s.section)
  const shown = section !== "start" && section !== "kontakt"

  return (
    <a
      href="#kontakt"
      aria-hidden={!shown || undefined}
      tabIndex={shown ? undefined : -1}
      data-shown={shown || undefined}
      className="tk-barcta relative me-1 inline-flex h-9 fm-press items-center rounded-full bg-fm-ink px-3.5 text-[0.8125rem] font-medium text-fm-inverse fm-focus after:absolute after:-inset-1 after:content-[''] hover:bg-fm-ink/85"
    >
      {label}
    </a>
  )
}
