import { PostCard } from "@/components/blog/PostCard"
import { Badge } from "@/components/ui/badge"
import { getAllPosts } from "@/lib/posts"
import {
  DsBlock,
  DsCode,
  DsInline,
  DsPreview,
  DsSection,
  DsTable,
} from "@/components/design-system/primitives"

export function ContentSection() {
  const sample = getAllPosts("pl")[0]
  if (!sample) return null

  return (
    <DsSection
      id="tresc"
      title="Wzorce treści"
      description="Wpisy blogowe pojawiają się w trzech postaciach o różnym ciężarze. Treść artykułu ma osobną, cięższą typografię — to jedyne miejsce w serwisie z nagłówkami w wadze bold."
    >
      <DsBlock
        title="Karta wpisu"
        description="Jeden komponent (src/components/blog/PostCard.tsx) w dwóch wariantach. Różnią się zaokrągleniem obrazu, wagą tytułu i gęstością metadanych."
        note={
          <>
            Cała karta jest klikalna dzięki nakładce{" "}
            <DsInline>after:absolute after:inset-0</DsInline> na linku tytułu. Odnośniki kategorii
            muszą więc mieć <DsInline>relative z-10</DsInline>, żeby pozostały klikalne.
          </>
        }
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Prawdziwy komponent na prawdziwym wpisie — nie kopia klas. */}
          <DsPreview label="Wyróżniony (/blog) — PostCard variant=featured">
            <PostCard post={sample} locale="pl" variant="featured" headingLevel="h3" />
          </DsPreview>
          <DsPreview label="Siatka (/blog, kategorie, „Czytaj dalej”) i strona główna">
            <PostCard post={sample} locale="pl" headingLevel="h3" />
          </DsPreview>
        </div>
      </DsBlock>

      <DsBlock
        title="Typografia artykułu"
        description="Treść wpisu składana jest przez wtyczkę typography Tailwinda i nadpisania w mdxComponents. Nagłówki są w wadze bold, akapity w kolorze foreground (nie muted), odnośniki w kolorze primary bez podkreślenia do czasu najechania."
      >
        <DsPreview label="Próbka składu">
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline prose-a:hover:underline">
            <p className="text-2xl font-bold tracking-tight">Nagłówek drugiego stopnia</p>
            <p>
              Akapit treści z <a href="#tresc">odnośnikiem</a>, <strong>wyróżnieniem</strong> oraz{" "}
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
            [
              "tabela",
              "border-collapse, nagłówek bg-muted/50",
              "Przewijana w poziomie na wąskich ekranach",
            ],
          ]}
        />
      </DsBlock>

      <DsBlock
        title="Taksonomia"
        description="Kategorie i tagi mają wspólną regułę adresów (slugify z lib/slug.ts) i jeden komponent linku (TermLink) w dwóch wariantach plakietki."
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
