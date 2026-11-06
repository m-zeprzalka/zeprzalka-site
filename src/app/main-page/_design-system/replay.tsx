"use client"

import { useState, type ReactNode } from "react"
import { RotateCcwIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"

/** Ponowne zamontowanie dzieci — animacje CSS wejścia odtwarzają się od nowa. */
export function Replay({ label, children }: { label: string; children: ReactNode }) {
  const [run, setRun] = useState(0)

  return (
    <div className="grid w-full gap-4">
      <div key={run}>{children}</div>
      <Button variant="outline" size="sm" className="w-fit" onClick={() => setRun((n) => n + 1)}>
        <RotateCcwIcon />
        {label}
      </Button>
    </div>
  )
}
