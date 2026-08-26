/**
 * Prosty limiter zgłoszeń w pamięci procesu.
 *
 * Świadomy kompromis: instancje funkcji na Vercelu są współdzielone między
 * żądaniami i żyją długo (Fluid Compute), więc licznik działa — ale nie jest
 * współdzielony między regionami ani gwarantowany po zimnym starcie. Zatrzymuje
 * to zwykłe zalewanie formularza, nie determinowanego napastnika. Gdy pojawi
 * się realny spam, następnym krokiem jest magazyn zewnętrzny (Upstash) albo
 * reguła Vercel WAF — patrz docs/ROADMAP.md.
 */
interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

/** Ile żądań na okno i jak długie jest okno. */
const LIMIT = 5
const WINDOW_MS = 10 * 60 * 1000

export interface RateLimitResult {
  allowed: boolean
  /** Sekundy do zwolnienia limitu — do komunikatu dla użytkownika. */
  retryAfter: number
}

export function checkRateLimit(key: string, now = Date.now()): RateLimitResult {
  // Sprzątanie przy okazji: mapa nie może rosnąć w nieskończoność.
  if (buckets.size > 5000) {
    for (const [id, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(id)
    }
  }

  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, retryAfter: 0 }
  }

  bucket.count += 1

  if (bucket.count > LIMIT) {
    return {
      allowed: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    }
  }

  return { allowed: true, retryAfter: 0 }
}

/**
 * Adres nadawcy zza proxy Vercela. `x-forwarded-for` może zawierać listę —
 * pierwszy wpis to klient.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return headers.get("x-real-ip") ?? "nieznany"
}
