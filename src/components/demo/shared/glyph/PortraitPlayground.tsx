"use client"

import { useId, useState } from "react"
import { cn } from "@/components/demo/forma/cn"
import { GlyphPortrait } from "./Portrait"
import {
  CHARSETS,
  FPS_OPTIONS,
  GLYPH_DEFAULTS,
  MODES,
  type Charset,
  type Fps,
  type GlyphSettings,
  type Mode,
} from "./settings"

type Control = "charset" | "mode" | "fps"

const LEGEND: Record<Control, string> = { charset: "Znaki", mode: "Animacja", fps: "Tempo" }

/**
 * Twarz ze znaków z małym panelem „pobaw się” (pomysł właściciela: przy twarzy
 * dać użytkownikowi wybrać animację i znaki). Trzy rzędy pigułek — zestaw,
 * animacja, tempo; wybór działa od razu, bez przeładowania. Panel to zwykłe
 * radia (klawiatura: Tab między grupami, strzałki w grupie).
 */
export function PortraitPlayground({
  className,
  portraitClassName,
  label,
  defaults,
  controls = ["charset", "mode", "fps"],
}: {
  className?: string
  portraitClassName?: string
  label?: string
  defaults?: Partial<GlyphSettings>
  controls?: readonly Control[]
}) {
  const [settings, setSettings] = useState<Partial<GlyphSettings>>({ ...defaults })
  const id = useId()
  const value = { ...GLYPH_DEFAULTS, ...settings }

  const groups: Record<Control, { options: { id: string; label: string }[]; current: string }> = {
    charset: {
      options: CHARSETS.map(({ id: key, label: text }) => ({ id: key, label: text })),
      current: value.charset,
    },
    mode: {
      options: MODES.map(({ id: key, label: text }) => ({ id: key, label: text })),
      current: value.mode,
    },
    fps: {
      options: FPS_OPTIONS.map((fps) => ({ id: String(fps), label: `${fps} kl./s` })),
      current: String(value.fps),
    },
  }

  const choose = (control: Control, next: string) =>
    setSettings((current) => ({
      ...current,
      ...(control === "charset" ? { charset: next as Charset } : null),
      ...(control === "mode" ? { mode: next as Mode } : null),
      ...(control === "fps" ? { fps: Number(next) as Fps } : null),
    }))

  return (
    <div className={cn("grid gap-5", className)}>
      <GlyphPortrait settings={settings} label={label} className={portraitClassName} />
      <div className="grid gap-3">
        {controls.map((control) => (
          <fieldset key={control} className="flex flex-wrap items-center gap-1.5">
            <legend className="sr-only">{LEGEND[control]}</legend>
            <span aria-hidden="true" className="w-full text-fm-micro text-fm-ink-3 sm:w-20">
              {LEGEND[control]}
            </span>
            {groups[control].options.map((option) => (
              <label
                key={option.id}
                className="relative inline-flex h-9 cursor-pointer items-center rounded-full px-3.5 text-fm-small text-fm-ink-2 shadow-fm-ring transition-[background-color,color] hover:text-fm-ink has-[:checked]:bg-fm-ink has-[:checked]:text-fm-inverse has-[:checked]:shadow-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fm-ink"
              >
                <input
                  type="radio"
                  name={`${id}-${control}`}
                  value={option.id}
                  checked={groups[control].current === option.id}
                  onChange={() => choose(control, option.id)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </fieldset>
        ))}
      </div>
    </div>
  )
}
