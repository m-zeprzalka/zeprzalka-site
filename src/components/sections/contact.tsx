import type { ComponentProps } from "react"
import { CopyEmail } from "@/components/layout/copy-email"
import { SECTION } from "@/lib/anchors"
import { ContactForm } from "./contact-form"
import { SectionHeading } from "./section-heading"

export function Contact({
  title,
  lead,
  email,
  labels,
  form,
}: {
  title: string
  lead: string
  email: string
  labels: { copyEmail: string; copied: string; responseTimeLabel: string; responseTime: string }
  form: ComponentProps<typeof ContactForm>
}) {
  return (
    <section id={SECTION.contact} aria-labelledby="kontakt-title" className="column mt-28 md:mt-36">
      <SectionHeading id="kontakt-title" title={title} lead={lead} />
      <div className="reveal">
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <CopyEmail email={email} label={labels.copyEmail} copiedLabel={labels.copied} />
          <p className="text-sm text-muted-foreground">
            {labels.responseTimeLabel}{" "}
            <span className="text-foreground">{labels.responseTime}</span>
          </p>
        </div>
        <ContactForm {...form} />
      </div>
    </section>
  )
}
