import { ArticleSample } from "@/app/main-page/_design-system/article-sample"
import {
  Code,
  DsNote,
  DsSection,
  Lead,
  type ChapterProps,
} from "@/app/main-page/_design-system/ds-section"
import { Example, HighlightedCode } from "@/app/main-page/_design-system/example"

/** Tak widok wpisu (`post-page.tsx`) zamienia MDX w treść — ten sam tor co próbka niżej. */
const USAGE = `import { mdxComponents } from "@/app/main-page/_components/blog/mdx-components"
import "@/app/main-page/_components/blog/article.css"
import { renderMdx } from "@/lib/mdx"

const { content, headings } = await renderMdx(post.content, mdxComponents(locale))
// headings (h2) → spis rozdziałów w lewym torze (TableOfContents)
return <div className="article">{content}</div>`

export function ArticleChapter(props: ChapterProps) {
  return (
    <DsSection {...props} lead="MDX, typografia artykułu i kolorowanie składni">
      <DsNote>
        <Lead>Tor treści.</Lead> <Code>renderMdx</Code> (<Code>src/lib/mdx.ts</Code>): remark-gfm
        (tabele, listy zadań), rehype-slug (kotwice nagłówków — z nich spis rozdziałów) i
        rehype-highlight (klasy <Code>hljs-*</Code>). <Code>mdxComponents</Code> zmienia tylko
        semantykę: linki wewnętrzne przez <Code>next/link</Code> z prefiksem podglądu, zewnętrzne w
        nowej karcie z dopiskiem dla czytnika, obrazy przez <Code>next/image</Code>, przewijana
        tabela, film YouTube bez śledzenia, blok kodu.
      </DsNote>
      <DsNote>
        <Lead>Wygląd.</Lead> <Code>article.css</Code> (ładowany tylko na wpisach): odstępy w{" "}
        <Code>em</Code> między elementami najwyższego poziomu, więc nagłówek ma więcej powietrza nad
        sobą niż pod sobą. Blok kodu to <Code>CodeBlock</Code> z <Code>code.css</Code>: przewijanie
        w poziomie (przystanek Tab tylko wtedy, gdy kod się nie mieści), kopiowanie bez znaczników
        kolorowania, potwierdzenie także dla czytnika.
      </DsNote>
      <HighlightedCode code={USAGE} language="tsx" />
      <Example
        file="article.mdx"
        title="Wpis MDX — typografia i bloki kodu"
        className="block"
        note={
          <>
            Plik <Code>.mdx</Code> wyrenderowany jak wpis. Bloki: <Code>tsx</Code>, <Code>ts</Code>{" "}
            (z długą linią — przewijanie), <Code>css</Code>, <Code>bash</Code>, <Code>json</Code>,{" "}
            <Code>html</Code>, <Code>diff</Code>. Najedź na blok — przycisk kopiowania.
          </>
        }
      >
        <ArticleSample />
      </Example>
    </DsSection>
  )
}
