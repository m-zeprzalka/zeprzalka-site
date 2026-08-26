import { SITE_NAME } from "@/lib/site"

/**
 * Wspólny układ kart Open Graph. Renderowany przez Satori (next/og), które
 * obsługuje wyłącznie flexbox — stąd jawne `display: flex` przy każdym
 * elemencie z wieloma dziećmi.
 *
 * Kolory odpowiadają tokenom motywu ciemnego, bo taki jest motyw domyślny
 * serwisu; karta ma więc wyglądać jak jego przedłużenie.
 */
export const OG_SIZE = { width: 1200, height: 630 }

const INK = "#0a0a0a"
const PAPER = "#fafafa"
const MUTED = "#a1a1a1"
const LINE = "#2a2a2a"

interface CardProps {
  /** Nadrzędny komunikat — nazwa serwisu albo tytuł wpisu. */
  title: string
  /** Wiersz nad tytułem: rola albo kategorie wpisu. */
  eyebrow: string
  /** Wiersz pod tytułem: krótki opis albo metadane. */
  footer?: string
}

export function OgCard({ title, eyebrow, footer }: CardProps) {
  // Długie tytuły dostają mniejszy stopień, żeby zawsze mieściły się w kadrze.
  const fontSize = title.length > 70 ? 58 : title.length > 45 ? 68 : 82

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: INK,
        color: PAPER,
        padding: "72px 80px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontSize,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${LINE}`,
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: PAPER }}>
          {SITE_NAME}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: MUTED }}>
          {footer ?? "www.zeprzalka.com"}
        </div>
      </div>
    </div>
  )
}
