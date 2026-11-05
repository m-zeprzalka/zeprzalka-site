"use client"

import { useState } from "react"
import { Dialog } from "radix-ui"
import { X } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { ThemeSwitch } from "@/components/demo/forma/ThemeSwitch"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { MotionToggle } from "./MotionToggle"

/**
 * Menu na telefonie i tablecie: arkusz od dołu (kciuk), duże cele dotyku,
 * podstrony, kontakt, adres do skopiowania, motyw i ruch glifów.
 */
export function MobileMenu({
  nav,
  email,
  labels,
}: {
  nav: DemoHomeContent["nav"]
  email: string
  labels: {
    open: string
    close: string
    title: string
    theme: string
    copied: string
    pause: string
    resume: string
  }
}) {
  const [root, setRoot] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)
  const contact = nav.find((item) => item.key === "contact")

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (value) setRoot(document.querySelector<HTMLElement>(".gll"))
        setOpen(value)
      }}
    >
      <Dialog.Trigger
        aria-label={labels.open}
        className="-me-1 grid size-11 fm-press place-items-center rounded-full text-fm-ink fm-focus transition-[background-color,scale] hover:bg-fm-fill lg:hidden"
      >
        <span aria-hidden="true" className="grid w-[18px] gap-[5px]">
          <span className="h-[1.5px] rounded-full bg-current" />
          <span className="h-[1.5px] rounded-full bg-current" />
        </span>
      </Dialog.Trigger>
      <Dialog.Portal container={root}>
        <Dialog.Overlay className="gll-overlay" />
        <Dialog.Content className="gll-dialog gll-menu" aria-describedby={undefined}>
          <div className="flex items-center justify-between px-3 pt-2">
            <Dialog.Title className="text-fm-small text-fm-ink-3">{labels.title}</Dialog.Title>
            <Dialog.Close
              aria-label={labels.close}
              className="grid size-11 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus hover:bg-fm-fill"
            >
              <X aria-hidden="true" className="size-4" />
            </Dialog.Close>
          </div>
          <nav aria-label={labels.title}>
            <ul className="mt-2 px-3">
              {nav
                .filter((item) => item.key !== "contact")
                .map((item) => (
                  <li key={item.key} className="border-b border-fm-edge">
                    <a
                      href={item.href}
                      className="flex min-h-14 items-center rounded-fm-sm text-[1.625rem] font-medium tracking-[-0.03em] fm-focus"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
          <div className="mt-6 grid gap-3 px-3">
            {contact && (
              <Button asChild size="lg">
                <a href="#kontakt" onClick={() => setOpen(false)}>
                  {contact.label}
                </a>
              </Button>
            )}
            <CopyButton
              value={email}
              label={email}
              copiedLabel={labels.copied}
              className="h-12 justify-center"
            />
            <div className="mt-1 flex items-center justify-center gap-2">
              <ThemeSwitch label={labels.theme} className="size-11" />
              <MotionToggle
                labels={{ pause: labels.pause, resume: labels.resume }}
                className="size-11"
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
