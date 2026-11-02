"use client"

import { useActionState, useEffect, useRef } from "react"
import Link from "next/link"
import { sendContactEmail, type ContactFormState } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MousePointerClick, CheckCircle, AlertCircle } from "lucide-react"
import { ROUTES, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"

const initialState: ContactFormState = { success: false, message: "" }

export function ContactForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(
    sendContactEmail,
    initialState
  )
  const copy = getCommon(locale).form
  const statusRef = useRef<HTMLDivElement>(null)

  // Po wysłaniu formularz znika albo dostaje komunikat — fokus przechodzi
  // na komunikat, żeby czytnik ekranu i klawiatura nie zostały „na body".
  useEffect(() => {
    if (state.message) statusRef.current?.focus()
  }, [state])

  if (state.success) {
    return (
      <div
        ref={statusRef}
        role="status"
        tabIndex={-1}
        className="flex items-center gap-3 p-5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 outline-none"
      >
        <CheckCircle className="w-5 h-5 shrink-0" />
        <p>{state.message}</p>
      </div>
    )
  }

  // Przy błędzie serwer odsyła wpisane wartości — React 19 czyści formularz
  // po każdej akcji, a `defaultValue` przywraca je po tym czyszczeniu.
  const fields = state.fields

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <div
          ref={statusRef}
          role="alert"
          tabIndex={-1}
          className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive outline-none"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      {/*
        Język formularza jedzie razem ze zgłoszeniem: komunikaty walidacji
        wracają w tym samym języku, w którym czytelnik wypełniał pola,
        a temat maila dostaje znacznik wersji angielskiej.
      */}
      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot — pole niewidoczne dla ludzi, wypełniają je tylko boty */}
      <div className="absolute opacity-0 -z-10 h-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="company">{copy.honeypot}</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/*
        Limity poniżej powtarzają reguły z akcji serwerowej (zod), żeby
        przeglądarka zatrzymała oczywisty błąd, zanim formularz wyjdzie.
      */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="text-sm font-medium mb-2 block">
            {copy.name} <span className="text-destructive">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder={copy.namePlaceholder}
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            defaultValue={fields?.name}
            className="py-6 px-4"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium mb-2 block">
            {copy.email} <span className="text-destructive">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={copy.emailPlaceholder}
            required
            maxLength={200}
            autoComplete="email"
            defaultValue={fields?.email}
            className="py-6 px-4"
          />
        </div>
      </div>

      <div>
        <label htmlFor="project-type" className="text-sm font-medium mb-2 block">
          {copy.projectType}
        </label>
        <Input
          id="project-type"
          name="project-type"
          type="text"
          placeholder={copy.projectTypePlaceholder}
          maxLength={200}
          defaultValue={fields?.projectType}
          className="py-6 px-4"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium mb-2 block">
          {copy.message} <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          minLength={5}
          maxLength={5000}
          defaultValue={fields?.message}
          className="flex w-full rounded-md border border-input bg-background p-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          placeholder={copy.messagePlaceholder}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="p-6 w-fit gap-2"
        disabled={pending}
      >
        <MousePointerClick className="w-4 h-4" />
        {pending ? copy.submitting : copy.submit}
      </Button>

      {/* Obowiązek informacyjny RODO (art. 13) w skrócie; pełna treść na osobnej stronie. */}
      <p className="text-xs text-muted-foreground">
        {copy.privacyNote}{" "}
        <Link
          href={ROUTES.privacy[locale]}
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          {copy.privacyLink}
        </Link>
      </p>
    </form>
  )
}
