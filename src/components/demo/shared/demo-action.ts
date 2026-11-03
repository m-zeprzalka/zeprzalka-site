/**
 * Atrapa akcji formularza dla dem. Dema nigdy nie wysyłają wiadomości —
 * prawdziwa akcja (`src/app/actions/contact.ts`) jest zarezerwowana dla serwisu.
 * `useActionState` przyjmuje zwykłą funkcję asynchroniczną, więc nie trzeba
 * tu "use server".
 */
export interface DemoFormState {
  success: boolean
  message: string
}

export async function sendContactEmail(): Promise<DemoFormState> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    success: false,
    message: "Wersja demo — formularz niczego nie wysyła.",
  }
}
