import Image from "next/image"
import { ArrowUpRightIcon, CopyIcon, SearchIcon, SunMoonIcon } from "lucide-react"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { buildSearch } from "@/lib/content/search"
import { getSource } from "@/lib/content/source"

const ICONS = { page: ArrowUpRightIcon, email: CopyIcon, theme: SunMoonIcon }

/**
 * Okno ⌘K jako obraz (`aria-hidden`) z prawdziwymi grupami (`buildSearch`) i klasami okna.
 * Żywe okno otwiera „Szukaj” w nagłówku — `cmdk` poza oknem przewijałby stronę do
 * zaznaczonej pozycji już przy wczytaniu.
 */
export function SearchExample() {
  const source = getSource("pl")
  const { searchPlaceholder, searchHints } = source.copy.ui
  const groups = buildSearch(source).map((group) => ({ ...group, items: group.items.slice(0, 2) }))

  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden rounded-2xl border bg-background shadow-lg"
    >
      <p className="flex h-14 items-center gap-3 border-b px-4 text-base text-muted-foreground">
        <SearchIcon className="size-4 shrink-0 opacity-50" />
        <span className="truncate">{searchPlaceholder}</span>
      </p>
      <div className="p-2">
        {groups.map((group, groupIndex) => (
          <div key={group.id} className="p-1">
            <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{group.heading}</p>
            {group.items.map((item, index) => {
              const Icon = ICONS[item.icon as keyof typeof ICONS]
              return (
                <p
                  key={item.id}
                  // Pierwsza pozycja zaznaczona — obwódka ≥ 3:1, jak `CommandItem`.
                  data-selected={(groupIndex === 0 && index === 0) || undefined}
                  className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-[0.9375rem] data-selected:bg-accent data-selected:ring-1 data-selected:ring-ring data-selected:ring-inset"
                >
                  {item.thumb ? (
                    <Image
                      src={item.thumb}
                      alt=""
                      width={56}
                      height={56}
                      sizes="28px"
                      className="size-7 shrink-0 rounded-md bg-muted object-cover"
                    />
                  ) : (
                    <span className="grid size-7 shrink-0 place-items-center rounded-md border bg-background">
                      {Icon && <Icon className="size-3.5 text-muted-foreground" />}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.hint && (
                    <span className="max-w-[40%] shrink-0 truncate text-xs text-muted-foreground">
                      {item.hint}
                    </span>
                  )}
                </p>
              )
            })}
          </div>
        ))}
      </div>
      <p className="flex flex-wrap items-center gap-4 border-t px-4 py-2.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <KbdGroup>
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
          </KbdGroup>
          {searchHints.select}
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd>
          {searchHints.open}
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>esc</Kbd>
          {searchHints.close}
        </span>
      </p>
    </div>
  )
}
