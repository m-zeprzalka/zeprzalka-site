/*
 * Kolejka przygotowań (wzór: `glif/queue.ts`): wydruki kafli liczą się po jednym,
 * w wolnej chwili wątku głównego (`requestIdleCallback`, najpóźniej po 600 ms),
 * zamiast wszystkie naraz w trakcie przewijania — to były długie klatki.
 * Zadanie anulowane przed startem nie rusza.
 */
const jobs: (() => void)[] = []
let pending = false

const later = (run: () => void) => {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(run, { timeout: 600 })
  } else setTimeout(run, 16)
}

function run() {
  pending = false
  const job = jobs.shift()
  job?.()
  if (jobs.length) schedule()
}

function schedule() {
  if (pending) return
  pending = true
  later(run)
}

export function enqueue(job: () => void): () => void {
  jobs.push(job)
  schedule()
  return () => {
    const index = jobs.indexOf(job)
    if (index >= 0) jobs.splice(index, 1)
  }
}
