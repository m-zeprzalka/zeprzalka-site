import { ContactForm } from "@/components/ContactForm"
import { HomeSection } from "@/components/home/HomeSection"
import { ROUTES, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getHome } from "@/i18n/content/home"

export function Contact({ locale }: { locale: Locale }) {
  const copy = getHome(locale).contact

  return (
    <HomeSection id="contact" title={copy.title} lead={copy.lead} gridClassName="gap-8">
      {/* Dawniej `Card` z wyłączonym tłem, ramką i odstępami — została sama układanka i nagłówek h3. */}
      <div className="flex flex-col gap-6">
        <div className="grid gap-1.5">
          <h3 className="text-xl font-semibold">{copy.cardTitle}</h3>
          <p className="text-sm text-muted-foreground">{copy.cardDescription}</p>
        </div>
        {/* `relative`: kontekst pozycjonowania pola-pułapki formularza (absolute, -z-10). */}
        <div className="relative">
          <ContactForm
            locale={locale}
            copy={getCommon(locale).form}
            privacyHref={ROUTES.privacy[locale]}
          />
        </div>
      </div>
    </HomeSection>
  )
}
