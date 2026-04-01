"use client"

import { useActionState } from "react"
import { sendContactEmail } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MousePointerClick, CheckCircle, AlertCircle } from "lucide-react"

const initialState = { success: false, message: "" }

export function KontaktForm() {
  const [state, formAction, pending] = useActionState(sendContactEmail, initialState)

  if (state.success) {
    return (
      <div className="flex items-center gap-3 p-5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
        <CheckCircle className="w-5 h-5 shrink-0" />
        <p>{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="text-sm font-medium mb-2 block">
            Imię <span className="text-destructive">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Twoje imię"
            required
            className="py-6 px-4"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium mb-2 block">
            Email <span className="text-destructive">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="twoj@email.pl"
            required
            className="py-6 px-4"
          />
        </div>
      </div>

      <div>
        <label htmlFor="project-type" className="text-sm font-medium mb-2 block">
          Rodzaj projektu
        </label>
        <Input
          id="project-type"
          name="project-type"
          type="text"
          placeholder="Strona internetowa / Animacja / Grafika..."
          className="py-6 px-4"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium mb-2 block">
          Wiadomość <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="flex w-full rounded-md border border-input bg-background p-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          placeholder="Opisz swój projekt lub pytanie. Im więcej szczegółów, tym lepiej..."
        />
      </div>

      <Button type="submit" size="lg" className="p-6 w-fit gap-2" disabled={pending}>
        <MousePointerClick className="w-4 h-4" />
        {pending ? "Wysyłanie..." : "Wyślij wiadomość"}
      </Button>
    </form>
  )
}
