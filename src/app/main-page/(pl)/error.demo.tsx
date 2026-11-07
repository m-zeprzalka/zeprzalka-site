"use client"

import dynamic from "next/dynamic"
import type { ErrorBoundaryProps } from "@/app/main-page/_components/views/error-view"

/** Ekran błędu dochodzi dopiero przy błędzie — granica jest w drzewie każdej trasy. */
const ErrorView = dynamic(() =>
  import("@/app/main-page/_components/views/error-view").then((m) => m.ErrorView)
)

/** Błąd w trasie podglądu: ekran w powłoce nowej wersji (po przepięciu: `src/app/(pl)/error.tsx`). */
export default function ErrorPage(props: ErrorBoundaryProps) {
  return <ErrorView locale="pl" {...props} />
}
