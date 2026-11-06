import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/main-page/_components/ui/accordion"

export function AccordionExample() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="one">
        <AccordionTrigger>Projektowanie produktu</AccordionTrigger>
        {/* forceMount: treść zamkniętego elementu zostaje w HTML (SEO), poza Tabem. */}
        <AccordionContent forceMount>Od analizy potrzeb po prototyp.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Development i technologia</AccordionTrigger>
        <AccordionContent forceMount>Responsywne, wydajne serwisy.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
