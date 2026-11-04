"use client"

import { Dialog } from "radix-ui"
import { ArrowRight, Menu, X } from "lucide-react"
import { CopyButton } from "@/components/demo/forma/CopyButton"

/**
 * Menu na telefonie: arkusz z góry (Radix Dialog — fokus uwięziony, Escape,
 * przywrócenie fokusu). Duże cele dotyku, e-mail do skopiowania i główna
 * akcja na dole — kciuk ma je blisko. Wejście 300 ms krzywą szuflady.
 */
export function MobileMenu({
  links,
  email,
  cta,
  labels,
}: {
  links: readonly { key: string; label: string; href: string }[]
  email: string
  cta: { label: string; href: string }
  labels: { open: string; close: string; title: string; copied: string }
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label={labels.open}
        className="grid size-11 fm-press place-items-center rounded-full text-fm-ink fm-focus transition-[background-color,scale] duration-150 hover:bg-fm-fill md:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fm tf-sheet fixed inset-x-0 top-0 z-50 flex max-h-[100dvh] flex-col overflow-y-auto overscroll-contain rounded-b-[2rem] bg-fm-surface px-(--fm-gutter) pt-[max(env(safe-area-inset-top),0px)] pb-6 shadow-fm-float outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:animate-in data-[state=open]:slide-in-from-top">
          <div className="flex h-14 items-center justify-between">
            <Dialog.Title className="text-[0.9375rem] font-semibold tracking-[-0.02em]">
              {labels.title}
            </Dialog.Title>
            <Dialog.Close
              aria-label={labels.close}
              className="-mr-1.5 grid size-11 fm-press place-items-center rounded-full text-fm-ink fm-focus transition-[background-color,scale] duration-150 hover:bg-fm-fill"
            >
              <X aria-hidden="true" className="size-5" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">{labels.title}</Dialog.Description>
          <nav aria-label="Nawigacja mobilna" className="mt-2">
            <ul>
              {links.map((item) => (
                <li key={item.key} className="border-b last:border-b-0">
                  <a
                    href={item.href}
                    className="flex h-14 items-center justify-between text-[1.375rem] font-medium tracking-[-0.025em] text-fm-ink fm-focus"
                  >
                    {item.label}
                    <ArrowRight aria-hidden="true" className="size-5 text-fm-ink-3" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <CopyButton
              value={email}
              label={email}
              copiedLabel={labels.copied}
              className="h-12 justify-center"
            />
            <Dialog.Close asChild>
              <a
                href={cta.href}
                className="inline-flex h-12 fm-press items-center justify-center gap-2 rounded-full bg-fm-ink px-6 text-[0.9375rem] font-medium text-fm-inverse fm-focus transition-[background-color,scale] duration-150 ease-fm-snap select-none"
              >
                {cta.label}
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
