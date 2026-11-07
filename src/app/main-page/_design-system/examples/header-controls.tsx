import { CopyEmail } from "@/app/main-page/_components/layout/copy-email"
import { LanguageSwitch } from "@/app/main-page/_components/layout/language-switch"
import { ThemeToggle } from "@/app/main-page/_components/layout/theme-toggle"
import { NewMark } from "@/app/main-page/_components/sections/new-mark"

export function HeaderControlsExample() {
  return (
    <>
      <LanguageSwitch label="Język (przykład)" locale="pl" fallback="/en" />
      <ThemeToggle label="Zmień motyw" />
      <CopyEmail email="m@zeprzalka.com" label="Kopiuj adres e-mail" copiedLabel="Skopiowano" />
      <span>
        Wpis
        <NewMark label="Nowy" />
      </span>
    </>
  )
}
