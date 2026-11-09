import type { Metadata } from "next"
import { TableOfContents } from "@/app/main-page/_components/layout/table-of-contents"
import { PeekProvider } from "@/app/main-page/_components/peek/peek-context"
import { PeekStage } from "@/app/main-page/_components/peek/peek-stage"
import { getHomeContent } from "@/app/main-page/_lib/content/home"
import { ArticleChapter } from "@/app/main-page/_design-system/chapters/article"
import { ColorsChapter } from "@/app/main-page/_design-system/chapters/colors"
import { ComponentsChapter } from "@/app/main-page/_design-system/chapters/components"
import { GridChapter } from "@/app/main-page/_design-system/chapters/grid"
import { HomeChapter } from "@/app/main-page/_design-system/chapters/home"
import { IconsChapter } from "@/app/main-page/_design-system/chapters/icons"
import { MotionChapter } from "@/app/main-page/_design-system/chapters/motion"
import { PrinciplesChapter } from "@/app/main-page/_design-system/chapters/principles"
import { ShapesChapter } from "@/app/main-page/_design-system/chapters/shapes"
import { ShellChapter } from "@/app/main-page/_design-system/chapters/shell"
import { SubpagesChapter } from "@/app/main-page/_design-system/chapters/subpages"
import { TypeChapter } from "@/app/main-page/_design-system/chapters/type"
import { PageHeaderExample } from "@/app/main-page/_design-system/examples/page-header"

export const metadata: Metadata = {
  title: "Design system — nowa wersja",
  robots: { index: false, follow: false },
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
 * Design system nowej wersji strony: tokeny, komponenty shadcn z `_components/ui`,
 * powłoka, kompozycje startu i podstron, treść wpisu i ruch — każdy przykład żywy,
 * z kodem czytanym z pliku. Jak każda strona z frazami: jeden `PeekProvider` z kartami
 * startu i jeden `PeekStage`. Strona wewnętrzna (noindex), tylko po polsku — wyjątek z AGENTS.md.
 */
export default function DesignSystemPage() {
  const { peeks } = getHomeContent("pl")

  return (
    <PeekProvider peeks={peeks}>
      <TableOfContents
        label="Rozdziały"
        sections={CHAPTERS.map(({ id, label }) => ({ id, label }))}
      />
      <PageHeaderExample />
      {CHAPTERS.map(({ id, label, Chapter }) => (
        <Chapter key={id} id={id} title={label} />
      ))}
      <PeekStage />
    </PeekProvider>
  )
}
