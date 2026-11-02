/**
 * Prosty limiter zgłoszeń w pamięci procesu.
 *
 * Świadomy kompromis: licznik żyje w pamięci jednej instancji funkcji. Przy
 * włączonym Fluid Compute instancje są współdzielone i żyją długo, więc działa
 * dobrze; bez niego (stan projektu w 11.2026 — do włączenia w panelu) realny
 * limit to 5 × liczba instancji. Zatrzymuje
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
    // Twardy sufit na wypadek zalewu z wielu adresów naraz.
    if (buckets.size > 20_000) buckets.clear()
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
 * Adres nadawcy zza proxy Vercela. Vercel nadpisuje oba nagłówki adresem
 * klienta (fałszywego `x-forwarded-for` z zewnątrz nie przepuszcza), ale
 * `x-real-ip` jest pojedynczą wartością — bezpieczniejszy, gdyby serwis
 * stanął kiedyś za innym proxy, które dokleja adresy do listy.
 */
export function clientKey(headers: Headers): string {
  const real = headers.get("x-real-ip")
  if (real) return real.trim()
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return "nieznany"
}
