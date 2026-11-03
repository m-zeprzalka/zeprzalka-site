import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/layout/Logo"
import { ThemeToggle } from "@/components/ThemeToggle"
import {
  DsBlock,
  DsInline,
  DsPreview,
  DsSection,
  DsTable,
} from "@/components/design-system/primitives"
import { getCommon } from "@/i18n/content/common"

export function AppKitSection() {
  return (
    <DsSection
      id="aplikacja"
      title="Komponenty aplikacji"
      description="Warstwa nad shadcn: elementy specyficzne dla tego serwisu. Domyślnie renderowane na serwerze; klienckie są tylko te, które potrzebują przeglądarki (stan, zdarzenia, obserwatory) — opisane w kolumnie „Typ”."
    >
      <DsBlock title="Rejestr">
        <DsTable
          head={["Komponent", "Rola", "Typ"]}
          rows={[
            ["layout/Header", "Przyklejony nagłówek, h-16, tło 65% + blur", "Serwer"],
            [
              "layout/ReadingProgress",
              "Pasek postępu czytania — sam CSS (animacja przewijania)",
              "Serwer",
            ],
            ["layout/Footer", "Trzy kolumny: opis, nawigacja, social", "Serwer"],
            ["layout/Logo", "Nazwa domeny + sygnet (kliencki jest tylko LogoGlyph)", "Serwer"],
            ["layout/NavLink", "Link nawigacji z aria-current dla bieżącej sekcji", "Klient"],
            [
              "layout/MobileNav",
              "Przycisk menu; panel (Sheet) wczytywany przy pierwszym dotknięciu",
              "Klient",
            ],
            ["ThemeToggle", "Przełącznik motywu (next-themes)", "Klient"],
            ["PageHeader", "Nagłówek podstrony: badge, H1, lead, separator", "Serwer"],
            ["ContactForm", "Formularz + akcja serwerowa, honeypot, pola z aria-invalid", "Klient"],
            [
              "portfolio/PortfolioCard",
              "Kafel realizacji (kliencki jest tylko LazyVideo)",
              "Serwer",
            ],
            ["ScrollToTop", "Przewija na górę po zmianie ścieżki", "Klient"],
            ["blog/ActiveTOC", "Spis treści wpisu ze śledzeniem pozycji", "Klient"],
            ["blog/CodeBlock", "Blok kodu z przyciskiem kopiowania", "Klient"],
            ["blog/YouTubeEmbed", "Fasada „kliknij, by wczytać” + youtube-nocookie", "Klient"],
            ["blog/PostCta", "Wezwanie do wyceny pod każdym wpisem", "Serwer"],
          ]}
        />
      </DsBlock>

      <DsBlock
        title="Znaki nawigacji"
        description="Logo i przełącznik motywu — jedyne elementy obecne na każdej stronie."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <DsPreview label="Logo" code="Znak losowany z listy 170 symboli, podmieniany co 1 s">
            <Logo locale="pl" />
          </DsPreview>
          <DsPreview label="Przełącznik motywu" code='variant="outline" size="icon"'>
            <ThemeToggle
              label={getCommon("pl").ui.themeToggle}
              className={buttonVariants({ variant: "outline", size: "icon" })}
            />
          </DsPreview>
        </div>
      </DsBlock>

      <DsBlock
        title="PageHeader"
        description="Wspólny nagłówek podstron: opcjonalny badge, H1, lead i separator. Używany na /blog i /kontakt."
        note={
          <>
            Próbka niżej odtwarza układ klasa w klasę, ale tytuł składa akapitem. Prawdziwy
            komponent renderuje <DsInline>&lt;h1&gt;</DsInline>, a katalog ma już własny nagłówek
            pierwszego stopnia — dwa H1 na jednej stronie psułyby jej strukturę.
          </>
        }
      >
        <DsPreview code='<PageHeader badge="Kontakt" title="Porozmawiajmy" description="…" />'>
          <div>
            <Badge variant="outline" className="mb-6 w-fit px-4 py-2 text-sm">
              Kontakt
            </Badge>
            <p className="mb-4 text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
              Porozmawiajmy
            </p>
            <p className="max-w-2xl text-xl text-muted-foreground">
              Masz pomysł na projekt? Chętnie go omówię i zaproponuję rozwiązanie dopasowane do
              Twoich potrzeb.
            </p>
            <Separator className="mt-10" />
          </div>
        </DsPreview>
      </DsBlock>

      <DsBlock
        title="Nagłówek i stopka"
        description="Nagłówek jest przyklejony pod paskiem postępu; oba używają tego samego przepisu na tło: 65% krycia plus rozmycie."
        note={
          <>
            Nagłówek ma <DsInline>top-1</DsInline>, a pasek postępu <DsInline>top-0</DsInline> z{" "}
            <DsInline>z-60</DsInline> — pasek jest więc nad nagłówkiem. Klasa{" "}
            <DsInline>z-60</DsInline> nie należy do domyślnej skali Tailwinda; działa, ale wypada ją
            opisać w systemie albo zamienić na <DsInline>z-50</DsInline> z odpowiednią kolejnością.
          </>
        }
      >
        <DsPreview
          label="Przepis na warstwę przyklejoną"
          code="sticky bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
        >
          <div className="rounded-lg border">
            <div className="h-1 w-2/3 bg-gradient-to-r from-primary/20 to-primary" />
            <div className="flex h-16 items-center justify-between border-t px-4">
              <span className="text-sm font-medium">zeprzalka.com</span>
              <span className="text-sm text-muted-foreground">Blog · O mnie · Kontakt</span>
            </div>
          </div>
        </DsPreview>
      </DsBlock>
    </DsSection>
  )
}
