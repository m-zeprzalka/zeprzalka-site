"use client"

import type { ErrorBoundaryProps } from "@/components/system/ErrorView"
import { LazyErrorView } from "@/components/system/LazyErrorView"

export default function ErrorPage(props: ErrorBoundaryProps) {
  return <LazyErrorView locale="pl" {...props} />
}
