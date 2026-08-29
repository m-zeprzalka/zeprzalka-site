"use client"

import { ErrorView } from "@/components/system/ErrorView"

export default function Error(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorView locale="pl" {...props} />
}
