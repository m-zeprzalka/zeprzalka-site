"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { Tabs } from "radix-ui"

/**
 * Zakładki grup realizacji jako segment z pigułką, która przesuwa się pod
 * aktywną pozycję (250 ms, CSS — bez animacji układu w wątku głównym).
 * Na telefonie segment przewija się w poziomie, gdy etykiety się nie mieszczą.
 */
export function WorkTabs({
  groups,
  value,
}: {
  groups: readonly { id: string; label: string; count: number }[]
  value: string
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState<{ x: number; width: number } | null>(null)

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    function place() {
      const active = list?.querySelector<HTMLElement>('[data-state="active"]')
      if (active) setPill({ x: active.offsetLeft, width: active.offsetWidth })
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(list)
    return () => observer.disconnect()
  }, [value])

  return (
    <div className="-mx-(--re-gutter) -my-1 [scrollbar-width:none] overflow-x-auto px-(--re-gutter) py-1 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      <Tabs.List
        ref={listRef}
        aria-label="Rodzaje realizacji"
        data-pill={pill ? "" : undefined}
        className="re-tabs relative inline-flex h-11 items-center rounded-full bg-fm-fill p-1"
      >
        {pill && (
          <span
            aria-hidden="true"
            className="re-pill absolute top-1 bottom-1 left-0 rounded-full bg-fm-surface shadow-fm-card dark:bg-fm-fill-strong"
            style={{ width: pill.width, translate: `${pill.x}px 0` }}
          />
        )}
        {groups.map((group) => (
          <Tabs.Trigger
            key={group.id}
            value={group.id}
            className="relative z-10 inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap text-fm-ink-2 fm-focus transition-colors duration-150 select-none hover:text-fm-ink data-[state=active]:text-fm-ink"
          >
            {group.label}
            <span className="text-fm-ink-3 tabular-nums">{group.count}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </div>
  )
}
