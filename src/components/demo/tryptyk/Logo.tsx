"use client"

import { useState } from "react"
import { cn } from "../forma/cn"
import { Glyph } from "./Glyph"

/**
 * Wariacja obecnego znaku: glif w miękkim kafelku + imię i nazwisko. Glif
 * jest znacznikiem sekcji (patrz `Glyph`), więc logo mówi „gdzie jesteś”.
 * Rola pod nazwiskiem tylko w lewej szynie (`withRole`).
 */
export function Logo({
  name,
  role,
  withRole = false,
  className,
}: {
  name: string
  role?: string
  withRole?: boolean
  className?: string
}) {
  const [hover, setHover] = useState(false)

  return (
    <a
      href="#start"
      onPointerEnter={(event) => event.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      className={cn(
        "group relative flex min-w-0 items-center gap-3 rounded-fm-md fm-focus after:absolute after:-inset-2 after:content-['']",
        withRole && "items-start",
        className
      )}
    >
      <span className="tk-mark grid size-8 shrink-0 place-items-center rounded-fm-md bg-fm-ink font-mono text-[1.0625rem] leading-none text-fm-inverse">
        <Glyph hover={hover} className="tk-mark__glyph" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-[0.9375rem] leading-8 font-medium tracking-[-0.01em] text-fm-ink">
          {name}
        </span>
        {withRole && role && (
          <span className="-mt-1 text-[0.8125rem] leading-[1.4] text-balance text-fm-ink-3">
            {role}
          </span>
        )}
      </span>
    </a>
  )
}
