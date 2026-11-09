import { Segments } from "@/app/main-page/_components/peek/segments"

/** „Harmonijka” w miniaturze: te same klasy i pory `--enter-*` co start i podstrony. */
export function CascadeExample() {
  return (
    // Kształty zamiast treści — liczy się kolejność wejścia, nie napisy.
    <div aria-hidden="true" className="grid w-full gap-4 sm:grid-cols-[6rem_minmax(0,1fr)]">
      <div className="flex items-center justify-between gap-3 motion-safe:animate-enter-down motion-safe:[animation-delay:var(--enter-header)] sm:col-span-2">
        <span className="text-sm font-medium">zeprzalka.com</span>
        <span className="h-7 w-28 rounded-full bg-secondary" />
      </div>
      <ul className="hidden content-start gap-2 text-xs text-muted-foreground motion-safe:animate-enter-side motion-safe:[animation-delay:var(--enter-rail)] sm:grid">
        <li className="text-foreground">Start</li>
        <li>Usługi</li>
        <li>Blog</li>
      </ul>
      <div className="grid gap-4">
        <p className="flex items-center gap-2 text-xs text-muted-foreground motion-safe:animate-enter motion-safe:[animation-delay:var(--enter-status)]">
          <span className="size-2 rounded-full bg-success" />
          Status
        </p>
        <p className="text-xl font-medium tracking-tight">
          <span className="enter-stagger [--enter-delay:var(--enter-title)] [--enter-step:40ms]">
            <Segments segments={[{ text: "Tytuł słowo po słowie," }]} split="block" />
          </span>{" "}
          <span className="enter-stagger text-muted-foreground [--enter-delay:var(--enter-lead)] [--enter-step:16ms]">
            <Segments segments={[{ text: "potem szare rozwinięcie zdania." }]} split="block" />
          </span>
        </p>
        <div className="flex gap-2 motion-safe:animate-enter motion-safe:[animation-delay:var(--enter-actions)]">
          <span className="h-9 w-32 rounded-full bg-primary" />
          <span className="h-9 w-28 rounded-full border" />
        </div>
        <div className="aspect-video rounded-2xl bg-muted motion-safe:animate-enter-media motion-safe:[animation-delay:var(--enter-media)]" />
      </div>
    </div>
  )
}
