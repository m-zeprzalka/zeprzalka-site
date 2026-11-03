import type { CSSProperties } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import { buttonVariants } from "@/components/demo/forma/Button"
import { LiveDot } from "@/components/demo/forma/Chip"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { typo } from "@/components/demo/forma/typo"
import { cn } from "../forma/cn"
import { LocalTime } from "./LocalTime"
import { OpenContact } from "./OpenContact"

export interface ContactCardProps {
  status: string
  city: string
  title: string
  lead: string
  write: string
  email: string
  copied: string
  details: readonly { label: string; value: string }[]
  socialLabel: string
  socials: readonly { label: string; url: string }[]
  /** Dwie karty z talii i podpis pustej trzeciej. */
  deck: readonly { slug: string; poster: string }[]
  nextLabel: string
}

/**
 * Finał strony: duża karta 32 px w odwróconym motywie — ciemna wyspa na
 * jasnej stronie, jasna na ciemnej. Klasa `talia-invert` podmienia tokeny
 * Formy, więc przyciski, kopiowanie i kropka statusu same przyjmują
 * odwrócone kolory, bez osobnych wariantów.
 *
 * Od 1024 px po prawej leży mała talia: dwie realizacje i pusta karta na
 * wierzchu — „Twój projekt może być następny”. To ta sama geometria co
 * wachlarz w hero (rozkłada się pod kursorem), a pusta karta otwiera formularz.
 */
export function ContactCard({
  status,
  city,
  title,
  lead,
  write,
  email,
  copied,
  details,
  socialLabel,
  socials,
  deck,
  nextLabel,
}: ContactCardProps) {
  const cards = deck.length + 1
  return (
    <div className="talia-invert relative overflow-hidden rounded-fm-4xl p-6 pt-5 md:p-12 md:pt-10">
      <ul className="talia-fan talia-fan--mini" style={{ "--n": cards } as CSSProperties}>
        {deck.map((card, index) => (
          <li
            key={card.slug}
            aria-hidden="true"
            className="talia-fan__card"
            style={{ "--i": index } as CSSProperties}
          >
            <span className="block aspect-[4/5] rounded-fm-3xl bg-fm-surface p-1.5 shadow-fm-ring">
              <span className="relative block size-full overflow-hidden rounded-[1.125rem] opacity-70">
                <Image src={card.poster} alt="" fill sizes="10rem" className="object-cover" />
              </span>
            </span>
          </li>
        ))}
        <li className="talia-fan__card" style={{ "--i": deck.length } as CSSProperties}>
          <OpenContact
            href={`mailto:${email}`}
            className="group flex aspect-[4/5] flex-col justify-between rounded-fm-3xl bg-fm-ink p-4 text-fm-inverse fm-focus"
          >
            <span className="grid size-10 place-items-center rounded-full bg-fm-inverse/10 transition-[rotate] duration-500 group-hover:rotate-90">
              <Plus aria-hidden="true" className="size-5" />
            </span>
            <span className="text-base leading-snug font-semibold tracking-[-0.02em] text-pretty">
              {typo(nextLabel)}
            </span>
          </OpenContact>
        </li>
      </ul>

      <div className="flex items-center justify-between gap-4 text-fm-small text-fm-ink-2">
        <span className="flex items-center gap-2.5">
          <LiveDot />
          {status}
        </span>
        <LocalTime city={city} />
      </div>

      <h2
        id="kontakt-tytul"
        className="mt-14 max-w-[14ch] text-fm-display font-semibold text-balance md:mt-20"
      >
        {typo(title)}
      </h2>
      <p className="mt-5 max-w-xl text-fm-lead text-pretty text-fm-ink-2">{typo(lead)}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <OpenContact
          href={`mailto:${email}`}
          className={cn(buttonVariants({ size: "lg" }), "px-8")}
        >
          {write}
        </OpenContact>
        <CopyButton
          value={email}
          label={email}
          copiedLabel={copied}
          className="h-12 justify-between px-5"
        />
      </div>

      <dl className="mt-12 grid gap-5 border-t border-fm-edge pt-6 sm:grid-cols-3 md:mt-16">
        {details.map((detail) => (
          <div key={detail.label}>
            <dt className="text-fm-micro font-medium text-fm-ink-3">{detail.label}</dt>
            <dd className="mt-1 text-fm-small">{detail.value}</dd>
          </div>
        ))}
        <div>
          <dt className="text-fm-micro font-medium text-fm-ink-3">{socialLabel}</dt>
          <dd className="mt-1 flex gap-4 text-fm-small">
            {socials.map((social) => (
              <a
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm underline decoration-current/25 underline-offset-[3px] fm-focus transition-[text-decoration-color] hover:decoration-current"
              >
                {social.label}
              </a>
            ))}
          </dd>
        </div>
      </dl>
    </div>
  )
}
