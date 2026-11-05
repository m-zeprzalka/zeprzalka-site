"use client"

import dynamic from "next/dynamic"
import { useStage } from "./hooks"
import type { Peek, StageWork } from "./types"

/** Karta i jej dekoder glifów — osobny fragment JS, pobierany tylko tam, gdzie karta istnieje. */
const StageCard = dynamic(() => import("./Stage").then((module) => module.StageCard), {
  ssr: false,
})

/**
 * Scena w prawym torze siatki tylko na desktopie z myszą (≥ 1280 px). Na
 * telefonie, tablecie i laptopie kod karty w ogóle się nie pobiera — tam
 * podglądy są kartami pod słowem.
 */
export function Stage({
  works,
  covers,
  peeks,
}: {
  works: Readonly<Record<string, StageWork>>
  covers: Readonly<Record<string, string>>
  peeks: Readonly<Record<string, Peek>>
}) {
  const enabled = useStage()
  if (!enabled) return null
  return <StageCard works={works} covers={covers} peeks={peeks} />
}
