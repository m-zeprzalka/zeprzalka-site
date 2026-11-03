/**
 * Próbka „Wykłady”: wynik z ankiet studenckich na skali 0–100, a obok lupa
 * na przedział 99–100 z podziałką co 0,1 — precyzja, której nie widać gołym
 * okiem. Wypełnienie rośnie przy wejściu w kadr (CSS, `animation-timeline`).
 */
export function Gauge({ value, caption, note }: { value: number; caption: string; note: string }) {
  const fine = (value - 99) * 100

  return (
    <figure className="pz-sample">
      <p className="sr-only">
        {value.toFixed(2).replace(".", ",")}% — {caption}
      </p>
      <div className="pz-gauge" aria-hidden="true">
        <div className="pz-gauge__value">{value.toFixed(2).replace(".", ",")}%</div>

        <div className="pz-gauge__scale">
          <span className="pz-gauge__fill" style={{ "--v": value / 100 } as React.CSSProperties} />
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i} className="pz-gauge__tick" style={{ left: `${i * 10}%` }}>
              <span>{i * 10}</span>
            </span>
          ))}
        </div>

        <div className="pz-gauge__loupe">
          <span className="pz-label">99,0 – 100,0</span>
          <div className="pz-gauge__fine">
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i} className="pz-gauge__finetick" style={{ left: `${i * 10}%` }} />
            ))}
            <span className="pz-gauge__marker" style={{ left: `${fine}%` }} />
          </div>
        </div>
      </div>
      <figcaption className="pz-sample__caption">
        <span>{caption}</span>
        <span>{note}</span>
      </figcaption>
    </figure>
  )
}
