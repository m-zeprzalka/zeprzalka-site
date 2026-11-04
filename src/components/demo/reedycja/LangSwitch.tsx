import { cn } from "@/components/demo/forma/cn"

/**
 * Przełącznik języka jako segment: bieżący PL i link do prawdziwej wersji
 * angielskiej serwisu (`/en`). Piaskownica jest tylko po polsku, więc EN
 * prowadzi poza demo — tak jak dziś przycisk „EN” na produkcji.
 */
export function LangSwitch({ className }: { className?: string }) {
  const segment =
    "grid h-8 min-w-10 place-items-center rounded-full px-2.5 text-[0.8125rem] font-medium tracking-[0.01em]"

  return (
    <div
      role="group"
      aria-label="Język"
      className={cn("flex h-9 items-center rounded-full p-0.5 shadow-fm-ring", className)}
    >
      <span aria-current="true" className={cn(segment, "bg-fm-fill text-fm-ink")}>
        PL
      </span>
      <a
        href="/en"
        hrefLang="en"
        lang="en"
        aria-label="English"
        className={cn(
          segment,
          "text-fm-ink-3 fm-focus transition-colors duration-150 hover:text-fm-ink"
        )}
      >
        EN
      </a>
    </div>
  )
}
