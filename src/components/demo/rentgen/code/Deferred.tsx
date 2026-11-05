"use client"

import { useEffect, useSyncExternalStore, type ReactNode } from "react"

const noop = () => () => {}

/**
 * Zawartość kliszy dochodzi po hydratacji: HTML z serwera ma tylko projekt
 * (lżejszy dokument, szybsze pierwsze malowanie), a warstwa kodu — która i tak
 * potrzebuje JS (soczewka, przełącznik) — pojawia się chwilę później. Silnik
 * soczewki dostaje sygnał, żeby zmierzyć bliźniaki od nowa.
 */
export function Deferred({ children }: { children: ReactNode }) {
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
  useEffect(() => {
    if (hydrated) window.dispatchEvent(new Event("rg-faces"))
  }, [hydrated])
  return hydrated ? children : null
}
