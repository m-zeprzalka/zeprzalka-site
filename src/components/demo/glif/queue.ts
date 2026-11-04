/*
 * Kolejka przygotowań: wydruki kafli liczą się po jednym na klatkę, zamiast
 * wszystkie naraz, gdy kilka kafli równocześnie zbliża się do kadru (to były
 * długie zadania przy przewijaniu). Zadanie anulowane przed startem nie rusza.
 */
const jobs: (() => void)[] = []
let frame = 0

function run() {
  frame = 0
  const job = jobs.shift()
  job?.()
  if (jobs.length) frame = requestAnimationFrame(() => setTimeout(run, 0))
}

export function enqueue(job: () => void): () => void {
  jobs.push(job)
  if (!frame) frame = requestAnimationFrame(() => setTimeout(run, 0))
  return () => {
    const index = jobs.indexOf(job)
    if (index >= 0) jobs.splice(index, 1)
  }
}
