"use client"

import { useState } from "react"
import { SECTION } from "./anchors"
import { Decode } from "./Decode"
import { GlyphMark } from "./glyph"

/**
 * Znak: sygnet ze znaków (podmiana co sekundę, jak w obecnym logo) i samo
 * nazwisko. Wskazanie przepisuje nazwisko przez znaki w domenę — logo pokazuje
 * obie formy marki, a nazwa linku dla czytnika zostaje stała.
 */
export function Logo({
  surname,
  domain,
  label,
}: {
  surname: string
  domain: string
  label: string
}) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={`#${SECTION.start}`}
      aria-label={label}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={(event) => event.currentTarget.matches(":focus-visible") && setHover(true)}
      onBlur={() => setHover(false)}
      className="group relative flex h-11 items-center rounded-full pe-3 text-[0.9375rem] font-medium tracking-[-0.01em] whitespace-nowrap text-fm-ink fm-focus"
    >
      {/* Kolumna 28 px = kolumna kropki w spisie: sygnet i kropka na jednej osi, tekst na jednej linii. */}
      <span className="grid w-7 shrink-0 place-items-center">
        <GlyphMark className="text-fm-ink-2 transition-colors duration-150 group-hover:text-fm-ink" />
      </span>
      <Decode text={hover ? domain : surname} className="min-w-[13ch]" />
    </a>
  )
}
