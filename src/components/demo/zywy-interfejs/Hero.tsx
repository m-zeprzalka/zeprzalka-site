import type { CSSProperties, ReactNode } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { buttonVariants } from "../forma/Button"
import { Chip, LiveDot } from "../forma/Chip"
import { CopyButton } from "../forma/CopyButton"
import { Reveal } from "../forma/Reveal"
import { typo } from "../forma/typo"
import { InkHeadline } from "./InkHeadline"

const delay = (ms: number) => ({ "--fm-delay": `${ms}ms` }) as CSSProperties

/**
 * Pierwszy ekran, wyśrodkowany: status, nagłówek w dwóch tonach (druga
 * połowa zdania w szarości), linia roli, dwie akcje i cichy rząd liczb.
 * Wejście w CSS (Reveal) — nagłówek nie czeka na JavaScript. Tuż pod
 * pierwszym ekranem zaglądają już działające kafle kompetencji.
 */
export function Hero({
  status,
  title,
  role,
  highlight,
  rest,
  cta,
  email,
  copied,
  stats,
}: {
  status: string
  title: string
  role: string
  highlight: string
  rest: string
  cta: { href: string; label: string }
  email: string
  copied: string
  stats: ReactNode
}) {
  // „Przekształcam ambitne projekty” + „w produkty cyfrowe.” — podział na
  // ostatnim przyimku daje naturalny drugi ton bez zmiany tekstu.
  const split = title.lastIndexOf(" w ")
  const [first, second] = split > 0 ? [title.slice(0, split), title.slice(split + 1)] : [title, ""]

  return (
    <section className="fm-container flex flex-col items-center pt-32 pb-14 text-center md:pt-44 md:pb-20">
      <Chip className="mb-7 fm-rise bg-fm-surface shadow-fm-ring">
        <LiveDot /> {status}
      </Chip>
      <InkHeadline
        ink={
          <p className="mx-auto max-w-[16ch] text-fm-display font-semibold text-balance">
            <span className="opacity-0">{typo(first)}</span> {typo(second)}
          </p>
        }
      >
        <Reveal
          as="h1"
          delay={80}
          className="mx-auto max-w-[16ch] text-fm-display font-semibold text-balance"
          parts={[{ text: first }, { text: second, className: "text-fm-ink-3" }]}
        />
      </InkHeadline>
      <p
        className="mt-7 max-w-[36rem] fm-rise text-fm-lead text-balance text-fm-ink-2"
        style={delay(420)}
      >
        <span className="font-medium text-fm-ink">{role}</span>
        {typo(`${highlight.replace(/^\s*-\s*/, " — ")}${rest}`)}
      </p>
      <div
        className="mt-9 flex w-full fm-rise flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
        style={delay(520)}
      >
        <Link href={cta.href} className={buttonVariants({ size: "lg" })}>
          {cta.label}
          <ArrowUpRight />
        </Link>
        <CopyButton
          value={email}
          label={email}
          copiedLabel={copied}
          className="h-12 justify-center"
        />
      </div>
      <div className="mt-14 w-full fm-rise md:mt-20" style={delay(640)}>
        {stats}
      </div>
    </section>
  )
}
