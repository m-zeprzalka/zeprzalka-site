import { ContactForm } from "@/components/ContactForm"
import { HomeSection } from "@/components/home/HomeSection"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ROUTES, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getHome } from "@/i18n/content/home"

export function Contact({ locale }: { locale: Locale }) {
  const copy = getHome(locale).contact

  return (
    <HomeSection id="contact" title={copy.title} lead={copy.lead} gridClassName="gap-8">
      <Card className="shadow-none bg-transparent border-0 p-0">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-semibold">{copy.cardTitle}</CardTitle>
          <CardDescription>{copy.cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 relative">
          <ContactForm
            locale={locale}
            copy={getCommon(locale).form}
            privacyHref={ROUTES.privacy[locale]}
          />
        </CardContent>
      </Card>
    </HomeSection>
  )
}
