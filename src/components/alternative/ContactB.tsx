"use client"

import { useActionState } from "react"
import { sendContactEmail } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MousePointerClick, CheckCircle, AlertCircle } from "lucide-react"

const initialState = { success: false, message: "" }

export function ContactB() {
  const [state, formAction, pending] = useActionState(sendContactEmail, initialState)

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
                Wypełnij formularz, skontaktuję się z Tobą z propozycją i
                wstępną wyceną.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {state.success ? (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 mt-4">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <p>{state.message}</p>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  {state.message && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p>{state.message}</p>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-medium mb-2 block"
                    >
                      Twoje imię <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Podaj imię"
                      required
                      className="py-6 px-4 mt-4"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium mb-2 block"
                    >
                      Email kontaktowy <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="twoj@email.pl"
                      required
                      className="py-6 px-4 mt-4"
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
                      name="project-type"
                      type="text"
                      placeholder="Strona internetowa / Animacja / Grafik..."
                      className="py-6 px-4 mt-4"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="text-sm font-medium mb-2 block"
                    >
                      Opis szczegółów projektu <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background p-4 text-sm ring-offset-background placeholder:text-muted-foreground mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Opisz swoje cele, wyzwania lub pytania. Im więcej szczegółów, tym lepiej będę mógł Ci pomóc..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="p-6 w-fit" disabled={pending}>
                    <MousePointerClick />
                    {pending ? "Wysyłanie..." : "Wyślij wiadomość"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
