const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

/**
 * Liczba jak na liczniku mechanicznym: każda cyfra to taśma 0–9 przesunięta
 * do wartości. Animację robi CSS (start od zera przy wejściu), a czytnik
 * ekranu dostaje zwykły tekst — taśmy są ukryte przed drzewem dostępności.
 * Bez JavaScriptu i przy ograniczonym ruchu liczba stoi od razu na miejscu.
 */
export function Odometer({ value, index = 0 }: { value: string; index?: number }) {
  return (
    <span>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="pz-odo">
        {[...value].map((char, i) =>
          /\d/.test(char) ? (
            <span key={i} className="pz-odo__digit">
              <span
                className="pz-odo__tape"
                style={{ "--d": Number(char), "--i": index + i } as React.CSSProperties}
              >
                {DIGITS.map((digit) => (
                  <span key={digit}>{digit}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i}>{char}</span>
          )
        )}
      </span>
    </span>
  )
}
