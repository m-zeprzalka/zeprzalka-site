import { AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DsBlock,
  DsInline,
  DsPreview,
  DsSection,
} from "@/components/design-system/primitives"

export function StatesSection() {
  return (
    <DsSection
      id="stany"
      title="Stany i komunikaty"
      description="Serwis ma pięć stanów niestandardowych: fokus, wyłączenie, wysyłanie, sukces i błąd. Wszystkie korzystają z tokenów — żaden nie wprowadza własnego koloru poza zielenią potwierdzenia."
    >
      <DsBlock
        title="Fokus i wyłączenie"
        description="Fokus rysuje pierścień o grubości 3 px w kolorze ring z 50% krycia. Elementy wyłączone tracą wskaźnik myszy i mają 50% krycia."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <DsPreview label="Pole w stanie fokusu" code="focus-visible:ring-ring/50 focus-visible:ring-[3px]">
            <Input
              placeholder="Kliknij lub przejdź tabulatorem"
              className="py-6 px-4"
            />
          </DsPreview>
          <DsPreview label="Wyłączone" code="disabled:opacity-50 disabled:pointer-events-none">
            <div className="flex items-center gap-3">
              <Button disabled>Wyślij wiadomość</Button>
              <Input disabled placeholder="Pole wyłączone" />
            </div>
          </DsPreview>
        </div>
      </DsBlock>

      <DsBlock
        title="Komunikaty formularza"
        description="Formularz kontaktowy zwraca dokładnie dwa komunikaty: potwierdzenie zastępujące cały formularz i błąd nad polami."
        note={
          <>
            Oba komunikaty są dziś zbudowane ręcznie z klas, mimo że komponent{" "}
            <DsInline>alert</DsInline> jest w projekcie. Sukces używa też
            surowej zieleni <DsInline>bg-green-500/10</DsInline> — poza paletą
            tokenów.
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <DsPreview label="Sukces">
            <div className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-5 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p>Wiadomość wysłana. Odezwę się wkrótce!</p>
            </div>
          </DsPreview>
          <DsPreview label="Błąd">
            <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Podaj poprawny adres e-mail.</p>
            </div>
          </DsPreview>
        </div>
      </DsBlock>

      <DsBlock title="Ładowanie i strony błędów">
        <div className="grid gap-4 md:grid-cols-3">
          <DsPreview label="Ekran ładowania (app/loading.tsx)">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-12 w-full rounded-xl bg-muted/20" />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-16 rounded-xl bg-muted/20" />
                <Skeleton className="h-16 rounded-xl bg-muted/20" />
                <Skeleton className="h-16 rounded-xl bg-muted/20" />
              </div>
            </div>
          </DsPreview>

          <DsPreview label="404">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-4xl font-bold tracking-tight text-primary">404</p>
              <p className="text-lg font-medium">Strona nie znaleziona</p>
              <p className="text-sm text-muted-foreground">
                Przejdźmy na stabilny grunt.
              </p>
            </div>
          </DsPreview>

          <DsPreview label="Błąd aplikacji">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-xl font-bold">Coś poszło nie tak!</p>
              <p className="text-sm text-muted-foreground">
                Wystąpił nieoczekiwany błąd.
              </p>
              <Button size="sm">Spróbuj ponownie</Button>
            </div>
          </DsPreview>
        </div>
      </DsBlock>
    </DsSection>
  )
}
