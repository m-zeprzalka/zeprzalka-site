/**
 * Rodzaj projektu w formularzu kontaktowym — wspólny zapis akcji i formularza. Formularz ma
 * kilka pigułek z tym samym `name` (dawniej jedno pole tekstowe — akcja przyjmuje oba); akcja
 * składa je w jedną listę, a po błędzie walidacji odsyła ją w tej postaci (formularz rozbija ją
 * po `SEPARATOR`).
 * Etykiety opcji nie mogą więc zawierać separatora.
 */
export const PROJECT_TYPE_SEPARATOR = ", "

/** Wartości pola `project-type` jako jedna lista; puste i same spacje znikają. */
export function joinProjectTypes(values: readonly FormDataEntryValue[]): string {
  return values
    .flatMap((value) => (typeof value === "string" && value.trim() ? [value.trim()] : []))
    .join(PROJECT_TYPE_SEPARATOR)
}

/** Lista odesłana przez akcję z powrotem jako zaznaczone opcje. */
export function splitProjectTypes(value: string | undefined): string[] {
  return value ? value.split(PROJECT_TYPE_SEPARATOR) : []
}
