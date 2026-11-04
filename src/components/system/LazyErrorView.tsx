"use client"

import dynamic from "next/dynamic"

/**
 * Granice błędów (`error.tsx`, `global-error.tsx`) ładują się z każdą trasą —
 * sam ekran dopiero wtedy, gdy błąd naprawdę wystąpi.
 */
export const LazyErrorView = dynamic(() => import("./ErrorView").then((m) => m.ErrorView))
