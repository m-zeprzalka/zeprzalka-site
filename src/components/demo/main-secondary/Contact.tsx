import { ContactForm } from "@/components/demo/main-secondary/ContactForm"
import { Reveal } from "@/components/demo/main-secondary/Reveal"
import { Section, SectionHeader } from "@/components/demo/main-secondary/Section"
import { Words } from "@/components/demo/main-secondary/Words"
import { contact, sections } from "@/components/demo/shared/home-content"

export function Contact() {
  return (
    <Section meta={sections.contact}>
      <SectionHeader meta={sections.contact} />

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <Reveal className="flex flex-col gap-4 self-start lg:sticky lg:top-24 lg:col-span-5">
          <h3 className="ms-h3 max-w-md text-balance">
            <Words parts={contact.title} />
          </h3>
          <p className="max-w-md text-lg text-pretty text-muted-foreground">
            {contact.description}
          </p>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-7">
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  )
}
