import { ArticleSample } from "@/design-system/article-sample"
import { Code, DsNote, DsSection, Lead, type ChapterProps } from "@/design-system/ds-section"
import { Example, HighlightedCode } from "@/design-system/example"

/** Tak widok wpisu (`post-page.tsx`) zamienia MDX w treść — ten sam tor co próbka niżej. */
const USAGE = `import "@/components/blog/article.css"
import { renderArticle } from "@/components/blog/render-article"

const { content, headings } = await renderArticle(post.content, locale)
// headings (h2) → spis rozdziałów w prawym torze (TableOfContents)
return <div className="article">{content}</div>`

export function ArticleChapter(props: ChapterProps) {
  return (
    <DsSection {...props} lead="MDX, typografia artykułu i kolorowanie składni">
      <DsNote>
        <Lead>Tor treści.</Lead> <Code>renderArticle</Code> (<Code>blog/render-article.ts</Code>) —
        jeden dla wpisu i tego katalogu — woła <Code>renderMdx</Code> (<Code>src/lib/mdx.ts</Code>):
        remark-gfm (tabele, listy zadań), rehype-slug (kotwice nagłówków — z nich spis rozdziałów) i
        rehype-highlight (klasy <Code>hljs-*</Code>; bloki <Code>mdx</Code> barwi gramatyka
        Markdownu przez alias). <Code>mdxComponents</Code> zmienia tylko semantykę: linki wewnętrzne
        przez <Code>next/link</Code>, zewnętrzne w nowej karcie z dopiskiem dla czytnika, obrazy
        przez <Code>next/image</Code>, przewijana tabela, film YouTube bez śledzenia, blok kodu.
      </DsNote>
      <DsNote>
        <Lead>Wygląd.</Lead> <Code>article.css</Code> (ładowany tylko na wpisach) ma wyraźny
        kontrast wielkości: tekst 17 px, od 768 px 19 px (interlinia 1,75 → 1,72), h2{" "}
        <Code>1,53 → 1,68 em</Code> (26 → 32 px), h3 <Code>1,25 em</Code> (21 → 24 px), h4 w
        wielkości tekstu, półgruby; tytuł wpisu stoi stopień wyżej (<Code>text-title</Code>). Tekst
        jest o ton cichszy (<Code>--article-text</Code>: 84% koloru tekstu na tle), a nagłówki,
        pogrubienia, linki i cytat (1,12 em) mają pełny kolor — hierarchia czyta się wielkością i
        kolorem naraz.
      </DsNote>
      <DsNote>
        <Lead>Rytm.</Lead> Odstępy w <Code>em</Code> między elementami najwyższego poziomu; nad
        nagłówkiem wyraźnie więcej powietrza niż pod nim (nagłówek należy do akapitu, który
        otwiera), obraz i film — 2 em. Blok kodu to <Code>CodeBlock</Code> z <Code>code.css</Code>{" "}
        (13 px, od 768 px 14 px): przewijanie w poziomie (przystanek Tab tylko wtedy, gdy kod się
        nie mieści), kopiowanie bez znaczników kolorowania, potwierdzenie także dla czytnika.
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
            <Code>html</Code>, <Code>diff</Code>, <Code>mdx</Code>. Najedź na blok — przycisk
            kopiowania.
          </>
        }
      >
        <ArticleSample />
      </Example>
    </DsSection>
  )
}
