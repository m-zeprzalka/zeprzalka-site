import { ContactForm } from "@/components/ContactForm"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Locale } from "@/i18n/config"
import { getHome } from "@/i18n/content/home"

export function Contact({ locale }: { locale: Locale }) {
  const copy = getHome(locale).contact

  return (
    <section
      className="flex flex-col justify-center p-4 py-6 md:py-8 lg:py-12 xl:py-16 xl:min-h-[calc(100vh-4rem)] container mx-auto"
      id="contact"
    >
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3 lg:sticky top-22 self-start">
          <div>
            <h2 className="text-3xl md:text-4xl md:font-semi-bold font-medium">
              {copy.title}
            </h2>
            <p className="text-muted-foreground lg:text-lg 2xl:text-xl mt-2 lg:mt-6 max-w-xs">
              {copy.lead}
            </p>
          </div>
        </div>
        <div className="lg:col-span-9">
          <Card className="shadow-none bg-transparent border-0 p-0">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-semibold">
                {copy.cardTitle}
              </CardTitle>
              <CardDescription>
                {copy.cardDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 relative">
              <ContactForm locale={locale} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
