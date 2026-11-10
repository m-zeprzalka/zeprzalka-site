import { CtaPanel } from "@/components/page/cta-panel"
import { pageHref } from "@/lib/routes"

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
