"use client"

import { useEffect, useSyncExternalStore } from "react"
import type { Charset } from "@/components/demo/shared/glyph"

/**
 * Zestaw znaków całej strony — wybór odwiedzającego przy twarzy (zabawa, którą
 * podsunął właściciel). Dopóki nikt nie wybierał (`null`), każda powierzchnia
 * ma domyślny zestaw silnika (twarz — sygnet, kafle — kropki z The Best Of);
 * po wyborze twarz, kafle, figury, soczewka i napis w stopce mówią jednym
 * „językiem”. Pierwszy render = serwer, zapisany wybór dochodzi po hydratacji.
 */
const KEY = "i2-charset"

let charset: Charset | null = null
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setCharset(next: Charset) {
  if (next === charset) return
  charset = next
  listeners.forEach((listener) => listener())
  try {
    localStorage.setItem(KEY, next)
  } catch {
    // tryb prywatny — wybór żyje do przeładowania
  }
}

/** Wybór odwiedzającego albo `null` (domyślne zestawy silnika). */
export function useCharset(): Charset | null {
  return useSyncExternalStore(
    subscribe,
    () => charset,
    () => null
  )
}

/** Odczyt zapisanego wyboru po hydratacji (raz na stronę). */
export function useRestoreCharset(allowed: readonly string[]) {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved && allowed.includes(saved)) setCharset(saved as Charset)
    } catch {
      // brak dostępu do pamięci — zostaje domyślny
    }
  }, [allowed])
}
