import type { Metadata } from "next"
import { TableOfContents } from "@/components/layout/table-of-contents"
import { PeekProvider } from "@/components/peek/peek-context"
import { PeekStage } from "@/components/peek/peek-stage"
import { getHomeContent } from "@/lib/content/home"
import { ArticleChapter } from "@/design-system/chapters/article"
import { ColorsChapter } from "@/design-system/chapters/colors"
import { ComponentsChapter } from "@/design-system/chapters/components"
import { GridChapter } from "@/design-system/chapters/grid"
import { HomeChapter } from "@/design-system/chapters/home"
import { IconsChapter } from "@/design-system/chapters/icons"
import { MotionChapter } from "@/design-system/chapters/motion"
import { PrinciplesChapter } from "@/design-system/chapters/principles"
import { ShapesChapter } from "@/design-system/chapters/shapes"
import { ShellChapter } from "@/design-system/chapters/shell"
import { SubpagesChapter } from "@/design-system/chapters/subpages"
import { TypeChapter } from "@/design-system/chapters/type"
import { PageHeaderExample } from "@/design-system/examples/page-header"

export const metadata: Metadata = {
  title: "Design system",
  description:
    "Katalog systemu zeprzalka.com: tokeny, pismo, siatka, komponenty shadcn, powłoka, kompozycje stron, treść wpisu i ruch.",
  // Dokumentacja wewnętrzna, tylko po polsku (wyjątek od zasady dwujęzyczności,
  // AGENTS.md) — poza wyszukiwarką, z własnym adresem kanonicznym.
  robots: { index: false, follow: false },
  alternates: { canonical: "/design-system" },
}

/**
 * Rozdziały w kolejności czytania: od fundamentów (tokeny) przez komponenty do kompozycji
 * stron i ruchu. Kotwica i tytuł z tej listy trafiają i do rozdziału, i do spisu w torze.
 */
const CHAPTERS = [
  { id: "zasady", label: "Zasady", Chapter: PrinciplesChapter },
  { id: "kolory", label: "Kolory", Chapter: ColorsChapter },
  { id: "pismo", label: "Pismo", Chapter: TypeChapter },
  { id: "siatka", label: "Siatka", Chapter: GridChapter },
  { id: "ksztalty", label: "Kształty", Chapter: ShapesChapter },
  { id: "ikony", label: "Ikony", Chapter: IconsChapter },
  { id: "komponenty", label: "Komponenty", Chapter: ComponentsChapter },
  { id: "nawigacja", label: "Nawigacja i powłoka", Chapter: ShellChapter },
  { id: "strona-glowna", label: "Strona główna", Chapter: HomeChapter },
  { id: "podstrony", label: "Podstrony", Chapter: SubpagesChapter },
  { id: "tresc-wpisu", label: "Treść wpisu", Chapter: ArticleChapter },
  { id: "ruch", label: "Ruch", Chapter: MotionChapter },
] as const

/**
 * Design system strony: tokeny, komponenty shadcn z `components/ui`,
 * powłoka, kompozycje startu i podstron, treść wpisu i ruch — każdy przykład żywy,
 * z kodem czytanym z pliku. Jak każda strona z frazami: jeden `PeekProvider` z kartami
 * startu i jeden `PeekStage`. Strona wewnętrzna (noindex), tylko po polsku — wyjątek z AGENTS.md.
 */
export default function DesignSystemPage() {
  const { peeks, ui } = getHomeContent("pl")

  return (
    <PeekProvider peeks={peeks} closeLabel={ui.closeCard}>
      <TableOfContents
        label="Rozdziały"
        sections={CHAPTERS.map(({ id, label }) => ({ id, label }))}
      />
      <PageHeaderExample />
      {/* Treść objęta spisem rozdziałów — za nią spis w torze się chowa. */}
      <div data-toc-scope="">
        {CHAPTERS.map(({ id, label, Chapter }) => (
          <Chapter key={id} id={id} title={label} />
        ))}
      </div>
      <PeekStage />
    </PeekProvider>
  )
}
