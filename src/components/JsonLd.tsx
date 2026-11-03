/**
 * Blok danych strukturalnych.
 *
 * `JSON.stringify` nie chroni przed sekwencją `</script>` — tytuł wpisu albo
 * opis z frontmattera zawierający ją zamknąłby znacznik i resztę potraktował
 * jak HTML. Zamiana `<` na sekwencję `\u003c` jest bezpieczna dla JSON-a (parser
 * odczyta ten sam znak) i odcina tę drogę raz, dla wszystkich stron.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
