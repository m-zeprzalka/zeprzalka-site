"use client"

import dynamic from "next/dynamic"
import type { ErrorBoundaryProps } from "@/components/views/error-view"

/** Ekran błędu dochodzi dopiero przy błędzie — granica jest w drzewie każdej trasy. */
const ErrorView = dynamic(() => import("@/components/views/error-view").then((m) => m.ErrorView))

/** Błąd w trasie: ekran w powłoce serwisu (nagłówek i stopka zostają). */
export default function ErrorPage(props: ErrorBoundaryProps) {
  return <ErrorView locale="en" {...props} />
}
