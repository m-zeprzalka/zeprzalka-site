import { ContactForm } from "@/components/demo/main-fourth/ContactForm"
import { Lines } from "@/components/demo/main-fourth/Lines"
import { Reveal } from "@/components/demo/main-fourth/Reveal"
import { Section, SectionHead } from "@/components/demo/main-fourth/Section"
import { pl } from "@/components/demo/main-fourth/typography"
import { contact, sections } from "@/components/demo/shared/home-content"

export function Contact() {
  return (
    <Section meta={sections.contact}>
      <SectionHead meta={sections.contact} />

      <Reveal className="m4-panel">
        <div className="m4-panel-grid">
          <div className="m4-panel-intro">
            <h3 className="m4-h3">
              <Lines lines={[contact.title]} />
            </h3>
            <p className="m4-lead">{pl(contact.description)}</p>
          </div>
          <div className="m4-panel-form">
            <ContactForm />
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
