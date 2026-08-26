import { ContactForm } from "@/components/main-third/ContactForm"
import { Frame } from "@/components/main-third/Frame"
import { Rise } from "@/components/main-third/Rise"
import { contact, sections } from "@/lib/home-content"

/**
 * Zamknięcie strony odwróconym blokiem: sekcja przełącza tokeny motywu na
 * przeciwne, więc formularz odcina się od reszty strony w obu motywach.
 * Komponenty shadcn czytają te same zmienne, nic nie wymaga nadpisań kolorów.
 */
export function Contact() {
  return (
    <Frame meta={sections.contact} className="m3-invert">
      <div className="grid gap-12 lg:grid-cols-10 lg:gap-12">
        <Rise className="flex flex-col gap-4 self-start lg:sticky lg:top-24 lg:col-span-4">
          <h3 className="m3-h3 max-w-sm text-balance">
            {contact.title.map((part, i) => (
              <span key={i} className={part.accent ? "m3-strong" : undefined}>
                {part.text}
                {i < contact.title.length - 1 ? " " : null}
              </span>
            ))}
          </h3>
          <p className="max-w-sm text-pretty text-muted-foreground">
            {contact.description}
          </p>
        </Rise>
        <Rise i={1} className="lg:col-span-6">
          <ContactForm />
        </Rise>
      </div>
    </Frame>
  )
}
