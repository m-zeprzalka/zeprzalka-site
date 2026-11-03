import "./precyzja.css"
import Link from "next/link"
import { Selection } from "./Selection"
import { Columns } from "./Columns"

/**
 * Specimen systemu „Precyzja” — wszystkie tokeny i prymitywy na jednej
 * stronie. Źródło prawdy: precyzja.css (warstwa 1). Ta strona niczego nie
 * definiuje, tylko pokazuje.
 */
const COLORS = [
  ["--pz-bg", "Tło"],
  ["--pz-fg", "Tekst, linie aktywne, przycisk główny"],
  ["--pz-muted", "Tekst drugorzędny (≥ 8:1)"],
  ["--pz-subtle", "Dane, podpisy (≥ 4,5:1)"],
  ["--pz-line", "Linia włosowa"],
  ["--pz-line-strong", "Linia konstrukcyjna, obrys pola"],
  ["--pz-surface", "Płótno próbki"],
  ["--pz-signal", "Rezerwa na jeden kolor (dziś = tekst)"],
] as const

const TYPE = [
  ["--pz-fs-display", "Display", "Przekształcam"],
  ["--pz-fs-h2", "Nagłówek sekcji", "Kompetencje"],
  ["--pz-fs-h3", "Nagłówek elementu", "Projektowanie produktu"],
  ["--pz-fs-lead", "Lead", "Umiejętności, które pomogą w sukcesie projektu"],
  ["--pz-fs-body", "Tekst", "Od analizy potrzeb użytkowników po prototyp."],
  ["--pz-fs-small", "Mały", "Polska, Warszawa"],
  ["--pz-fs-micro", "Dane (mono)", "P1 (120, 40) 1081 × 346"],
] as const

const SPACE = ["--pz-1", "--pz-2", "--pz-3", "--pz-4", "--pz-6", "--pz-8", "--pz-12", "--pz-16"]

const MOTION = [
  ["--pz-dur-1", "120 ms", "kolor, obrys"],
  ["--pz-dur-2", "240 ms", "stany przycisków, przełączniki"],
  ["--pz-dur-3", "480 ms", "przesunięcia, podkreślenia"],
  ["--pz-dur-4", "900 ms", "wejście nagłówka, odsłonięcie obrazu"],
] as const

function Row({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="pz-spec-row">
      <code className="pz-label">{name}</code>
      <div>{children}</div>
    </div>
  )
}

export function SystemSpecimen() {
  return (
    <div className="pz">
      <main className="pz-container py-16 md:py-24">
        <p className="pz-label">
          <Link href="/demo/precyzja" className="pz-link">
            ← demo strony głównej
          </Link>
        </p>
        <div className="mt-20">
          <Selection tag="h1">
            <h1 className="pz-h2">System „Precyzja”</h1>
          </Selection>
        </div>
        <p className="pz-lead mt-8">
          Monochrom, linia włosowa, kąty proste. Geist mówi, Geist Mono mierzy. Jeden plik tokenów,
          dwa motywy, siedem stopni pisma, osiem odstępów, cztery czasy ruchu.
        </p>

        <section className="pz-spec">
          <h2 className="pz-spec__title">Kolor</h2>
          <div className="pz-spec-swatches">
            {COLORS.map(([token, role]) => (
              <figure key={token}>
                <span className="pz-spec-swatch" style={{ background: `var(${token})` }} />
                <figcaption>
                  <code className="pz-label">{token}</code>
                  <span>{role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="pz-spec">
          <h2 className="pz-spec__title">Typografia</h2>
          {TYPE.map(([token, role, sample]) => (
            <Row key={token} name={`${token}  ${role}`}>
              <p
                className={token === "--pz-fs-micro" ? "pz-mono" : undefined}
                style={{
                  fontSize: `var(${token})`,
                  fontWeight:
                    token === "--pz-fs-display" || token === "--pz-fs-h2" ? 500 : undefined,
                  letterSpacing: token === "--pz-fs-display" ? "-0.055em" : undefined,
                  lineHeight: 1.05,
                }}
              >
                {sample}
              </p>
            </Row>
          ))}
        </section>

        <section className="pz-spec">
          <h2 className="pz-spec__title">Odstępy i siatka</h2>
          {SPACE.map((token) => (
            <Row key={token} name={token}>
              <span className="pz-spec-space" style={{ width: `var(${token})` }} />
            </Row>
          ))}
          <div className="pz-spec-grid">
            <Columns />
            <p className="pz-label">
              12 kolumn od 768 px, 4 na telefonie; margines i odstęp płynne
            </p>
          </div>
        </section>

        <section className="pz-spec">
          <h2 className="pz-spec__title">Ruch</h2>
          {MOTION.map(([token, value, use]) => (
            <Row key={token} name={`${token}  ${value}`}>
              <span className="pz-spec-motion" style={{ animationDuration: `var(${token})` }} />
              <span className="ml-4 text-[var(--pz-subtle)]">{use}</span>
            </Row>
          ))}
          <p className="pz-label mt-6">
            Krzywa --pz-ease-out: cubic-bezier(0.16, 1, 0.3, 1). Przy „ogranicz ruch” wszystko stoi.
          </p>
        </section>

        <section className="pz-spec">
          <h2 className="pz-spec__title">Prymitywy</h2>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="pz-btn pz-btn--solid">
              Przycisk główny
            </a>
            <a href="#" className="pz-btn pz-btn--line">
              Drugorzędny
            </a>
            <a href="#" className="pz-btn pz-btn--line pz-btn--sm">
              Mały
            </a>
            <a href="#" className="pz-link">
              Link tekstowy
            </a>
          </div>
          <label className="pz-field mt-10 max-w-md">
            <span className="pz-field__label">Pole formularza</span>
            <input className="pz-input" placeholder="Linia bazowa zamiast ramki" />
          </label>
        </section>
      </main>
    </div>
  )
}
