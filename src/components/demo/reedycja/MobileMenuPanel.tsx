"use client"

import { useRef, type RefObject } from "react"
import { Dialog } from "radix-ui"
import { ArrowDown, ArrowUpRight, X } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { ThemeSwitch } from "@/components/demo/forma/ThemeSwitch"
import { portalRoot } from "./ids"
import { LangSwitch } from "./LangSwitch"
import { Status } from "./Status"

export interface MenuProps {
  domain: string
  links: readonly { key: string; label: string; href: string }[]
  status: string
  cta: { label: string; href: string }
  email: string
  socials: readonly { label: string; url: string }[]
  labels: { open: string; close: string; theme: string; copied: string }
  open: boolean
  onOpenChange: (open: boolean) => void
  returnFocusTo: RefObject<HTMLButtonElement | null>
}

/**
 * Menu mobilne na cały ekran (dług nr 8: dziś 70% pustki). Góra — duże linki
 * w zasięgu kciuka po przewinięciu, dół — to, po co się tu przychodzi:
 * status, rozmowa, e-mail, motyw, język i profile.
 *
 * Link do sekcji tej strony zamyka menu i dopiero potem przewija — przy
 * zablokowanym przewijaniu (Radix) kotwica nie zadziałałaby od razu.
 */
export default function MobileMenuPanel({
  domain,
  links,
  status,
  cta,
  email,
  socials,
  labels,
  open,
  onOpenChange,
  returnFocusTo,
}: MenuProps) {
  const pendingHash = useRef<string | null>(null)

  function go(href: string) {
    if (!href.startsWith("#")) return false
    pendingHash.current = href.slice(1)
    onOpenChange(false)
    return true
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={portalRoot()}>
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            const id = pendingHash.current
            pendingHash.current = null
            if (!id) return returnFocusTo.current?.focus()
            history.pushState(null, "", `#${id}`)
            document.getElementById(id)?.scrollIntoView({ block: "start" })
            document.getElementById(`${id}-title`)?.focus({ preventScroll: true })
          }}
          className="re-menu fixed inset-0 z-50 flex h-dvh flex-col overflow-y-auto overscroll-contain bg-fm-canvas outline-none"
        >
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <div className="re-container flex h-(--re-header) shrink-0 items-center justify-between pt-[env(safe-area-inset-top)]">
            <span className="text-[0.9375rem] font-medium tracking-[-0.01em]">{domain}</span>
            <Dialog.Close
              aria-label={labels.close}
              className="grid size-10 fm-press place-items-center rounded-full bg-fm-surface text-fm-ink shadow-fm-ring fm-focus hover:bg-fm-fill"
            >
              <X aria-hidden="true" className="size-4" />
            </Dialog.Close>
          </div>

          <nav aria-label="Nawigacja mobilna" className="re-container mt-4">
            <ul>
              {links.map((link) => (
                <li key={link.key} className="border-b border-fm-edge">
                  <a
                    href={link.href}
                    onClick={(event) => {
                      if (go(link.href)) event.preventDefault()
                    }}
                    className="group flex min-h-16 items-center justify-between gap-4 rounded-fm-sm text-[1.75rem] leading-none font-medium tracking-[-0.03em] fm-focus"
                  >
                    {link.label}
                    {/* Strzałka mówi, dokąd prowadzi link: w dół tej strony albo na podstronę. */}
                    {link.href.startsWith("#") ? (
                      <ArrowDown
                        aria-hidden="true"
                        className="size-5 text-fm-ink-3 transition-[translate,color] duration-200 ease-fm-snap group-active:translate-y-0.5 group-active:text-fm-ink"
                      />
                    ) : (
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-5 text-fm-ink-3 transition-[translate,color] duration-200 ease-fm-snap group-active:translate-x-0.5 group-active:-translate-y-0.5 group-active:text-fm-ink"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="re-container mt-auto flex flex-col gap-3 pt-10 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <Status label={status} className="mb-3 self-start" />
            <Button asChild size="lg" className="w-full">
              <a
                href={cta.href}
                onClick={(event) => {
                  if (go(cta.href)) event.preventDefault()
                }}
              >
                {cta.label}
              </a>
            </Button>
            <CopyButton
              value={email}
              label={email}
              copiedLabel={labels.copied}
              className="h-12 w-full justify-center"
            />
            <div className="mt-5 flex items-center justify-between gap-4">
              <ul className="-ms-3 flex items-center text-sm">
                {socials.map((profile) => (
                  <li key={profile.label}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center rounded-full px-3 text-fm-ink-2 fm-focus hover:text-fm-ink"
                    >
                      {profile.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2">
                <LangSwitch />
                <ThemeSwitch label={labels.theme} className="shadow-fm-ring" />
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
