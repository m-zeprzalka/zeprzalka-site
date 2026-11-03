"use client"

import dynamic from "next/dynamic"
import type { ErrorBoundaryProps } from "@/components/system/ErrorView"

// Granica błędów ładuje się z każdą trasą — sam ekran (z `Button`, czyli `cva`
// i `tailwind-merge`) dopiero wtedy, gdy błąd naprawdę wystąpi.
const ErrorView = dynamic(() => import("@/components/system/ErrorView").then((m) => m.ErrorView))

export default function ErrorPage(props: ErrorBoundaryProps) {
  return <ErrorView locale="pl" {...props} />
}
