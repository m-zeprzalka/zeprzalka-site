"use client"

import { useActionState } from "react"
import { sendContactEmail, type DemoFormState } from "@/components/demo/shared/demo-action"

interface FormCopy {
  name: string
  namePlaceholder: string
  email: string
  emailPlaceholder: string
  projectType: string
  projectTypePlaceholder: string
  message: string
  messagePlaceholder: string
  submit: string
  submitting: string
}

const initial: DemoFormState = { success: false, message: "" }

/**
 * Formularz w języku „Precyzji”: sama linia bazowa, etykieta nad polem,
 * jeden przycisk. W demie akcja niczego nie wysyła (atrapa).
 */
export function ContactDemo({ copy }: { copy: FormCopy }) {
  const [state, action, pending] = useActionState(sendContactEmail, initial)

  return (
    <form action={action} className="pz-form">
      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
        <label className="pz-field">
          <span className="pz-field__label">{copy.name}</span>
          <input
            name="name"
            required
            minLength={2}
            autoComplete="name"
            className="pz-input"
            placeholder={copy.namePlaceholder}
          />
        </label>
        <label className="pz-field">
          <span className="pz-field__label">{copy.email}</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="pz-input"
            placeholder={copy.emailPlaceholder}
          />
        </label>
      </div>
      <label className="pz-field">
        <span className="pz-field__label">{copy.projectType}</span>
        <input name="project-type" className="pz-input" placeholder={copy.projectTypePlaceholder} />
      </label>
      <label className="pz-field">
        <span className="pz-field__label">{copy.message}</span>
        <textarea
          name="message"
          required
          rows={4}
          className="pz-input resize-none"
          placeholder={copy.messagePlaceholder}
        />
      </label>
      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" className="pz-btn pz-btn--solid" disabled={pending}>
          {pending ? copy.submitting : copy.submit}
        </button>
        <p role="status" className="pz-form__status">
          {state.message}
        </p>
      </div>
    </form>
  )
}
