import { ContactForm } from "@/components/ContactForm"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Contact() {
  return (
    <section
      className="flex flex-col justify-center p-4 py-6 md:py-8 lg:py-12 xl:py-16 xl:min-h-[calc(100vh-4rem)] container mx-auto"
      id="contact"
    >
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3 lg:sticky top-22 self-start">
          <div>
            <h2 className="text-3xl md:text-4xl md:font-semi-bold font-medium">
              Kontakt
            </h2>
            <p className="text-muted-foreground lg:text-lg 2xl:text-xl mt-2 lg:mt-6 max-w-xs">
              Wyślij niezobowiązującą wiadomość, aby otrzymać wycenę
            </p>
          </div>
        </div>
        <div className="lg:col-span-9">
          <Card className="shadow-none bg-transparent border-0 p-0">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-semibold">
                Opowiedz o swoim projekcie
              </CardTitle>
              <CardDescription>
                Wypełnij formularz, im bardziej szczegółowy opis, tym bardziej
                precyzyjną wycenę otrzymasz.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 relative">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
