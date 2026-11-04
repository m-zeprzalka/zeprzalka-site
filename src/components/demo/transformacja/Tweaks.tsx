"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Popover, ToggleGroup } from "radix-ui"
import { useTheme } from "next-themes"
import { SlidersHorizontal } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"

type Radius = "0" | "12" | "24"
type Density = "compact" | "comfortable"

const RADIUS: readonly { value: Radius; label: string }[] = [
  { value: "0", label: "0" },
  { value: "12", label: "12" },
  { value: "24", label: "24" },
]
const DENSITY: readonly { value: Density; label: string }[] = [
  { value: "compact", label: "Zwarta" },
  { value: "comfortable", label: "Swobodna" },
]
const THEMES = [
  { value: "light", label: "Jasny" },
  { value: "dark", label: "Ciemny" },
] as const

/**
 * Nagroda na koniec sceny: panel „Tokeny”, który w etapie Projekt był
 * ilustracją, teraz działa. Promień i gęstość zmieniają zmienne `--tf-r`
 * i `--tf-d` na korzeniu koncepcji (sekcje po scenie i rama wideo), motyw —
 * przez next-themes. Stan żyje tylko w tej wizycie. Pigułka pojawia się
 * dopiero po scenie i ustępuje treści przy przewijaniu w dół.
 */
export function Tweaks() {
  const ref = useRef<HTMLDivElement>(null)
  const [radius, setRadius] = useState<Radius>("24")
  const [density, setDensity] = useState<Density>("comfortable")
  const { resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [tucked, setTucked] = useState(false)

  const [inScene, setInScene] = useState(true)

  // Przy przewijaniu w dół pigułka chowa się pod krawędź ekranu (nie zasłania
  // treści), w górę i na końcu strony wraca — jak pasek narzędzi Safari.
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - last
      if (Math.abs(delta) < 6) return
      const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 160
      setTucked(delta > 0 && !nearEnd)
      last = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Dopóki widać scenę (hero z ramą i jej przyciskiem pauzy), pigułki nie ma —
  // w każdym trybie, także przy „ogranicz ruch”.
  useEffect(() => {
    const scene = document.getElementById("tf-scene")
    if (!scene) return
    const observer = new IntersectionObserver(([entry]) => setInScene(!!entry?.isIntersecting))
    observer.observe(scene)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = ref.current?.closest<HTMLElement>(".tf")
    if (!root) return
    root.dataset.tfRadius = radius
    root.dataset.tfDensity = density
  }, [radius, density])

  return (
    <div ref={ref} className="tf-tweaks tf-anim">
      <div className="tf-tweaks__inner" data-tucked={((tucked || inScene) && !open) || undefined}>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger className="inline-flex h-11 min-w-11 fm-press items-center justify-center gap-2 rounded-full bg-fm-surface/90 text-sm font-medium text-fm-ink shadow-fm-pop fm-focus backdrop-blur-md transition-[background-color,scale] duration-150 ease-fm-snap select-none hover:bg-fm-surface sm:ps-4 sm:pe-4.5">
            <SlidersHorizontal aria-hidden="true" className="size-4" />
            {/* Na telefonie sama ikona — etykieta zostaje dla czytników ekranu. */}
            <span className="sr-only sm:not-sr-only">Tokeny</span>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="top"
              align="end"
              sideOffset={10}
              collisionPadding={16}
              className="fm tf-sheet z-50 w-[17.5rem] origin-(--radix-popover-content-transform-origin) overflow-hidden rounded-fm-2xl bg-fm-surface shadow-fm-float outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.97] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.96]"
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <span className="text-[0.8125rem] font-semibold tracking-[-0.01em] text-fm-ink">
                  Tokeny
                </span>
                <span className="rounded-full bg-fm-fill px-2 py-0.5 text-[0.6875rem] font-medium text-fm-ink-2">
                  Forma
                </span>
              </div>
              <div className="flex flex-col gap-3.5 px-4 py-4">
                <Row label="Promień">
                  <Segmented value={radius} options={RADIUS} onChange={setRadius} label="Promień" />
                </Row>
                <Row label="Gęstość">
                  <Segmented
                    value={density}
                    options={DENSITY}
                    onChange={setDensity}
                    label="Gęstość"
                  />
                </Row>
                <Row label="Motyw">
                  <Segmented
                    value={resolvedTheme === "dark" ? "dark" : "light"}
                    options={THEMES}
                    onChange={setTheme}
                    label="Motyw"
                  />
                </Row>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[0.8125rem] text-fm-ink-3">{label}</span>
      {children}
    </div>
  )
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (value: T) => void
  label: string
}) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(next) => next && onChange(next as T)}
      aria-label={label}
      className="flex rounded-full bg-fm-fill p-0.5"
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            "h-8 min-w-10 rounded-full px-3 text-[0.75rem] font-medium text-fm-ink-2 fm-focus transition-[background-color,color,box-shadow] duration-150",
            "data-[state=on]:bg-fm-surface data-[state=on]:text-fm-ink data-[state=on]:shadow-fm-ring"
          )}
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}
