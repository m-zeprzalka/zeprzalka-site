import { ReadingProgress } from "@/components/layout/ReadingProgress"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

/** Dawne warianty stały wewnątrz układu serwisu — ten sam nagłówek i stopka. */
export default function ServiceChromeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReadingProgress />
      <Header locale="pl" />
      <main id="main">{children}</main>
      <Footer locale="pl" />
    </>
  )
}
