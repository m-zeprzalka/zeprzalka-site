import { ContactForm } from "@/components/sections/contact-form"
import { CopyEmail } from "@/components/layout/copy-email"
import { LabelRow } from "@/components/page/label-row"
import { PageHeader } from "@/components/page/page-header"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumb } from "@/lib/content/pages"
import { getSource } from "@/lib/content/source"
import { pageHref } from "@/lib/routes"
import { noOrphans } from "@/lib/text"
import type { Locale } from "@/i18n/config"
import { contactPageSchema } from "@/lib/page-schema"
import { CONTACT_EMAIL } from "@/lib/site"

/**
 * Kontakt: e-mail do skopiowania, miejsce i czas odpowiedzi jako lista opisowa
 * w rytmie kolumny etykiet, potem ten sam formularz co na starcie.
 */
export function ContactPage({ locale }: { locale: Locale }) {
  const { common, copy: strings, pages } = getSource(locale)
  const copy = pages.contact

  return (
    <>
      <JsonLd data={contactPageSchema(locale)} />
      <PageHeader
        breadcrumb={breadcrumb(locale, common.nav.contact)}
        title={copy.title}
        lead={copy.description}
      />
      <div className="column mt-14">
        <dl className="grid gap-5">
          <LabelRow label={copy.emailLabel} labelAs="dt" contentAs="dd" className="md:items-center">
            <CopyEmail
              email={CONTACT_EMAIL}
              label={strings.ui.copyEmail}
              copiedLabel={common.ui.copied}
            />
          </LabelRow>
          <LabelRow label={copy.locationLabel} labelAs="dt" contentAs="dd">
            {copy.locationValue}
          </LabelRow>
          <LabelRow label={copy.responseLabel} labelAs="dt" contentAs="dd">
            {copy.responseValue}
          </LabelRow>
        </dl>
        <p className="mt-8 max-w-[60ch] text-pretty text-muted-foreground">
          {noOrphans(copy.note)}
        </p>
        {/* `relative`: pole-pułapka formularza (absolute) nie zmienia kompozycji warstw. */}
        <div className="relative">
          <ContactForm
            locale={locale}
            copy={common.form}
            projectTypes={strings.contact.projectTypes}
            projectTypeHint={strings.contact.projectTypeHint}
            privacyHref={pageHref("privacy", locale)}
          />
        </div>
      </div>
    </>
  )
}
