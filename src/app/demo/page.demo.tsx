import Link from "next/link"
import { DEMOS } from "@/components/demo/registry"

export const metadata = { title: "Piaskownica" }

export default function DemoIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
        /demo · tylko podgląd i pnpm dev
      </p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight">Piaskownica projektowa</h1>
      <p className="mt-4 max-w-prose text-muted-foreground">
        Eksperymenty z wyglądem strony głównej, odizolowane od serwisu: własny układ, własny arkusz
        stylów, zero importów w drugą stronę. Na produkcji ten adres zwraca 404.
      </p>

      <ol className="mt-12 divide-y divide-border border-y border-border">
        {DEMOS.map((demo) => (
          <li key={demo.slug}>
            <Link
              href={`/demo/${demo.slug}`}
              className="group grid gap-1 py-5 outline-none focus-visible:ring-2 focus-visible:ring-ring md:grid-cols-[8rem_1fr]"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {demo.date}
                <br />
                {demo.status}
              </span>
              <span>
                <span className="font-medium underline-offset-4 group-hover:underline">
                  {demo.title}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{demo.summary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <p className="mt-12 text-sm text-muted-foreground">
        <Link href="/" className="underline underline-offset-4">
          ← Wróć do serwisu
        </Link>
      </p>
    </main>
  )
}
