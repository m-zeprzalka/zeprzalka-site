import { ArrowDown, Lock } from "lucide-react"
import type { TransformacjaContent } from "./content"
import { Artboard } from "./Artboard"
import { FrameDims } from "./FrameDims"
import { Intro } from "./Intro"
import { EditorPanel, TokensPanel } from "./Panels"
import { StageSync } from "./StageSync"
import { Stepper } from "./Stepper"

/**
 * Scena „Transformacja” = hero strony. Po lewej prawdziwe hero (h1, rola,
 * akcje) od pierwszej klatki; obok rama, w której ten sam nagłówek powstaje:
 * Szkic → Projekt → Kod → Produkt, sterowane przewijaniem (view timeline).
 *
 * Jeden DOM, dwa układy:
 * - desktop: cała sekcja (`tf-track`) jest wysoka, przyklejony jest kadr
 *   z obiema kolumnami (`tf-pin`);
 * - telefon: hero płynie normalnie, a wysoka jest dopiero część z ramą
 *   (`tf-run`), w której przykleja się stepper z ramą (`tf-stage`).
 * Na desktopie `tf-run` i `tf-stage` mają `display: contents`.
 */
export function Scene({
  content,
  hintLabel,
  skip,
}: {
  content: TransformacjaContent
  hintLabel: string
  skip: { label: string; href: string }
}) {
  return (
    <section id="tf-scene" className="tf-scene" aria-labelledby="tf-h1">
      <div id="tf-track" className="tf-track">
        <div className="tf-pin tf-container">
          <Intro
            hero={content.hero}
            name={content.person.name}
            worksLabel={content.portfolio.link.label}
          />
          <div id="tf-run" className="tf-run">
            <div className="tf-stage">
              <Stepper stages={content.stages} competencies={content.competencies} skip={skip} />
              <div className="tf-framebox">
                {/* Nad ramą: etykieta narzędzia, która w etapie Produkt staje się paskiem adresu. */}
                <div aria-hidden="true" className="tf-framelabel text-[0.75rem] font-medium">
                  <p className="tf-framelabel__tool tf-anim flex items-center justify-between gap-3 text-fm-ink-3">
                    <span className="text-fm-ink-2">Strona główna</span>
                    <FrameDims />
                  </p>
                  <p className="tf-framelabel__url tf-anim absolute inset-x-0 top-0 flex justify-center">
                    <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-fm-surface px-3 text-fm-ink-2 shadow-fm-ring">
                      <Lock className="size-3" />
                      {content.person.domain}
                    </span>
                  </p>
                </div>
                <div className="tf-frame">
                  <Artboard
                    hero={content.hero}
                    worksLabel={content.portfolio.link.label}
                    labels={{
                      pause: "Zatrzymaj wideo",
                      play: "Odtwórz wideo",
                      fallback: content.ui.videoFallback,
                      video: "Wideo",
                      owner: content.person.name.split(" ")[0] ?? content.person.name,
                    }}
                  />
                  {/* Nakładki żyją wewnątrz ramy (przycięte do niej, wcięcie 24 px). */}
                  <div className="tf-overlays">
                    <TokensPanel />
                    <EditorPanel
                      file={content.code.file}
                      lines={content.code.lines}
                      log={content.log}
                    />
                  </div>
                  {/* Zachęta na pierwszej klatce; gaśnie przy pierwszym przewinięciu. */}
                  <p aria-hidden="true" className="tf-hint tf-anim">
                    <span className="tf-hint__inner inline-flex h-9 items-center gap-2 rounded-full bg-fm-surface ps-4 pe-3.5 text-[0.8125rem] font-medium whitespace-nowrap text-fm-ink shadow-fm-pop">
                      {hintLabel}
                      <ArrowDown className="tf-hint__arrow size-3.5" />
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StageSync sceneId="tf-scene" />
    </section>
  )
}
