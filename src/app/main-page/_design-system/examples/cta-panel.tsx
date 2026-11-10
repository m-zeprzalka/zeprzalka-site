import { CtaPanel } from "@/app/main-page/_components/page/cta-panel"
import { pageHref } from "@/app/main-page/_lib/routes"

export function CtaPanelExample() {
  return (
    <CtaPanel
      id="ds-cta"
      className="mt-0! w-full px-0!"
      heading="Opisz projekt, odpowiem w 24 godziny"
      body="Najwyżej dwa działania: główne ze strzałką linku i ciche obok — trzeciego typ nie przyjmie."
      actions={[
        { label: "Poproś o wycenę", href: pageHref("contact", "pl") },
        { label: "Zobacz realizacje", href: pageHref("portfolio", "pl") },
      ]}
    />
  )
}
