import { Bar } from "@/components/layout/Bar"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

/** Dawne warianty stały wewnątrz układu serwisu — ten sam nagłówek i stopka. */
export default function ServiceChromeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Bar />
      <Header locale="pl" />
      <main id="main">{children}</main>
      <Footer locale="pl" />
    </>
  )
}
