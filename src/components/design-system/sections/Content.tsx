import { CalendarDays, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DsBlock,
  DsCode,
  DsInline,
  DsPreview,
  DsSection,
  DsTable,
} from "@/components/design-system/primitives"

export function ContentSection() {
  return (
    <DsSection
      id="tresc"
      title="Wzorce treści"
      description="Wpisy blogowe pojawiają się w trzech postaciach o różnym ciężarze. Treść artykułu ma osobną, cięższą typografię — to jedyne miejsce w serwisie z nagłówkami w wadze bold."
    >
      <DsBlock
        title="Karta wpisu"
        description="Trzy warianty tej samej informacji. Różnią się proporcją obrazu, wagą tytułu i liczbą metadanych."
        note={
          <>
            Cała karta jest klikalna dzięki nakładce{" "}
            <DsInline>after:absolute after:inset-0</DsInline> na linku tytułu.
            Odnośniki kategorii muszą więc mieć{" "}
            <DsInline>relative z-10</DsInline>, żeby pozostały klikalne.
          </>
        }
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <DsPreview label="Wyróżniony (/blog)">
            <article className="group relative">
              <div className="mb-6 aspect-[16/9] rounded-xl bg-muted" />
              <div className="space-y-3">
                <Badge variant="secondary">AI</Badge>
                <p className="text-2xl font-bold transition-colors group-hover:text-primary">
                  Tytuł wyróżnionego wpisu
                </p>
                <p className="line-clamp-2 text-muted-foreground">
                  Lead wpisu skrócony do dwóch wierszy.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    23.08.2026
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    12 min czytania
                  </span>
                </div>
              </div>
            </article>
          </DsPreview>

          <DsPreview label="Siatka (/blog)">
            <article className="group relative">
              <div className="mb-4 aspect-[16/9] rounded-lg bg-muted" />
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">
                  Next.js
                </Badge>
                <p className="line-clamp-2 font-bold transition-colors group-hover:text-primary">
                  Tytuł wpisu na liście
                </p>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  Lead wpisu w mniejszym stopniu.
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>23.08.2026</span>
                  <span>•</span>
                  <span>12 min czytania</span>
                </div>
              </div>
            </article>
          </DsPreview>

          <DsPreview label="Podgląd (strona główna)">
            <article className="group relative">
              <div className="mb-4 aspect-[16/9] rounded-lg bg-muted" />
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">
                  Design
                </Badge>
                <p className="line-clamp-2 font-bold transition-colors group-hover:text-primary">
                  Tytuł wpisu w podglądzie
                </p>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  Lead wpisu skrócony do dwóch wierszy.
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    23.08.2026
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    12 min
                  </span>
                </div>
              </div>
            </article>
          </DsPreview>
        </div>
      </DsBlock>

      <DsBlock
        title="Typografia artykułu"
        description="Treść wpisu składana jest przez wtyczkę typography Tailwinda i nadpisania w mdxComponents. Nagłówki są w wadze bold, akapity w kolorze foreground (nie muted), odnośniki w kolorze primary bez podkreślenia do czasu najechania."
      >
        <DsPreview label="Próbka składu">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <p className="text-2xl font-bold tracking-tight">Nagłówek drugiego stopnia</p>
            <p>
              Akapit treści z <a href="#tresc">odnośnikiem</a>,{" "}
              <strong>wyróżnieniem</strong> oraz{" "}
              <code className="rounded border bg-muted px-1.5 py-0.5 font-mono text-sm">
                fragmentem kodu
              </code>
              .
            </p>
            <blockquote className="my-6 rounded-r-lg border-l-4 border-primary bg-muted/30 px-6 py-4 not-italic">
              Cytat — obrys po lewej w kolorze primary, tło muted na 30%.
            </blockquote>
            <ul>
              <li>Element listy punktowanej</li>
              <li>Drugi element</li>
            </ul>
          </div>
        </DsPreview>
        <DsTable
          head={["Element", "Skład", "Uwaga"]}
          rows={[
            ["h2", "text-2xl font-bold tracking-tight mt-12 mb-4", "scroll-mt-24 pod spis treści"],
            ["h3", "text-xl font-bold tracking-tight mt-8 mb-3", "—"],
            ["p", "text-base leading-relaxed, kolor foreground", "Nie muted — to treść główna"],
            ["code", "bg-muted border rounded px-1.5 py-0.5", "Monospace, bez cudzysłowów"],
            ["pre", "komponent CodeBlock", "Podświetlanie rehype-highlight + kopiowanie"],
            ["tabela", "border-collapse, nagłówek bg-muted/50", "Przewijana w poziomie na wąskich ekranach"],
          ]}
        />
      </DsBlock>

      <DsBlock
        title="Taksonomia"
        description="Kategorie i tagi mają wspólną regułę adresów (slugify z lib/posts) i różną wagę wizualną."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="text-xs">
            Kategoria (outline)
          </Badge>
          <Badge variant="secondary" className="text-xs font-normal">
            Tag (secondary)
          </Badge>
        </div>
        <DsCode>
          {`slugify("Web Development") → "web-development"
/blog/kategoria/web-development   ·   /blog/tag/next-js`}
        </DsCode>
      </DsBlock>
    </DsSection>
  )
}
