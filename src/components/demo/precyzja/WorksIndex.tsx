"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export interface Work {
  slug: string
  title: string
  category: string
  group: string
  poster: string
  href: string
}

/**
 * Rejestr realizacji: wiersz = projekt, rodzaj pracy, dziedzina. Obrazy są
 * czarno-białe i odzyskują kolor dopiero przy wskazaniu — kolor należy do
 * pracy, nie do interfejsu. Na komputerze kadr podąża za kursorem (płynnie,
 * rAF), na telefonie stoi w wierszu jako miniatura.
 */
export function WorksIndex({ works }: { works: readonly Work[] }) {
  const listRef = useRef<HTMLOListElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const list = listRef.current
    const preview = previewRef.current
    if (!list || !preview) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    let target = { x: 0, y: 0 }
    let current = { x: 0, y: 0 }
    let frame = 0
    const tick = () => {
      current = {
        x: current.x + (target.x - current.x) * 0.18,
        y: current.y + (target.y - current.y) * 0.18,
      }
      preview.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
      frame = requestAnimationFrame(tick)
    }
    const onMove = (event: PointerEvent) => {
      const rect = list.getBoundingClientRect()
      target = { x: event.clientX - rect.left + 24, y: event.clientY - rect.top - 120 }
      if (!frame) {
        current = target
        frame = requestAnimationFrame(tick)
      }
    }
    const onLeave = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }
    list.addEventListener("pointermove", onMove, { passive: true })
    list.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(frame)
      list.removeEventListener("pointermove", onMove)
      list.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <div className="relative">
      <ol ref={listRef} className="pz-works" onPointerLeave={() => setActive(null)}>
        {works.map((work) => (
          <li key={work.slug}>
            <Link
              href={work.href}
              className="pz-work"
              data-active={active === work.slug || undefined}
              onPointerEnter={() => setActive(work.slug)}
              onFocus={() => setActive(work.slug)}
              onBlur={() => setActive(null)}
            >
              <span className="pz-work__title">{work.title}</span>
              <span className="pz-work__meta">{work.category}</span>
              <span className="pz-work__meta pz-work__group">{work.group}</span>
              <span className="pz-work__thumb" aria-hidden="true">
                <Image src={work.poster} alt="" fill sizes="96px" className="object-cover" />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div
        ref={previewRef}
        className="pz-preview"
        data-visible={active ? "" : undefined}
        aria-hidden="true"
      >
        {works.map((work) => (
          <Image
            key={work.slug}
            src={work.poster}
            alt=""
            fill
            sizes="360px"
            className="pz-preview__img"
            data-active={active === work.slug || undefined}
          />
        ))}
      </div>
    </div>
  )
}
