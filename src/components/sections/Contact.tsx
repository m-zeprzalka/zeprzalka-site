import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Contact() {
  return (
    <section
      className="flex flex-col justify-center p-4 py-6 md:py-8 lg:py-12 xl:py-16 min-h-[calc(100vh-4rem)] container mx-auto"
      id="contact"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6 lg:sticky top-22 self-start">
          <div>
            <h2 className="text-3xl md:text-4xl md:font-semi-bold font-medium">
              Wyślij niezobowiązującą wiadomość, aby otrzymać wycenę
            </h2>
            <p className="text-muted-foreground lg:text-lg 2xl:text-xl mt-2 lg:mt-6 max-w-xs">
              Masz ambitny pomysł, ale nie wiesz, od czego zacząć? A może
              potrzebujesz specjalisty, który pomoże Twojemu produktowi wejść na
              wyższy poziom?
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Opowiedz o swoim projekcie
            </CardTitle>
            <CardDescription>
              Wypełnij formularz, skontaktuję się z Tobą z propozycją i wstępną
              wyceną.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium mb-2 block"
                >
                  Twoje imię
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jak mam się do Ciebie zwracać?"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium mb-2 block"
                >
                  Email kontaktowy
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="twoj@email.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="project-type"
                  className="text-sm font-medium mb-2 block"
                >
                  Rodzaj projektu
                </label>
                <Input
                  id="project-type"
                  type="text"
                  placeholder="Strona internetowa / Animacja / Grafik..."
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="text-sm font-medium mb-2 block"
                >
                  Opis szczegółów projektu
                </label>
                <textarea
                  id="message"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Opisz swoje cele, wyzwania lub pytania. Im więcej szczegółów, tym lepiej będę mógł Ci pomóc..."
                />
              </div>

              <Button type="submit" className="w-full">
                Wyślij wiadomość
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
