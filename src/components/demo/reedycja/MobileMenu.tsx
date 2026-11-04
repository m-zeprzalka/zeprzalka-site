"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import type { MenuProps } from "./MobileMenuPanel"

const MobileMenuPanel = dynamic(() => import("./MobileMenuPanel"), { ssr: false })

/**
 * Przycisk „Menu” (poniżej 1024 px). Panel z Radix Dialog pobiera się przy
 * pierwszym dotknięciu albo fokusie — nie obciąża pierwszego wczytania.
 * Przycisk stoi poza Dialogiem, więc fokus wraca do niego przez `returnFocusTo`.
 */
export function MobileMenu(props: Omit<MenuProps, "open" | "onOpenChange" | "returnFocusTo">) {
  const [open, setOpen] = useState(false)
  const [requested, setRequested] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const request = () => setRequested(true)

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerDown={request}
        onPointerEnter={request}
        onFocus={request}
        onClick={() => {
          request()
          setOpen(true)
        }}
        className="inline-flex h-10 fm-press items-center gap-2.5 rounded-full bg-fm-surface ps-4 pe-3.5 text-sm font-medium text-fm-ink shadow-fm-ring fm-focus transition-[background-color,scale] select-none hover:bg-fm-fill lg:hidden"
      >
        Menu
        <span aria-hidden="true" className="flex w-3.5 flex-col gap-[3px]">
          <span className="h-[1.5px] rounded-full bg-current" />
          <span className="h-[1.5px] rounded-full bg-current" />
        </span>
      </button>
      {requested && (
        <MobileMenuPanel {...props} open={open} onOpenChange={setOpen} returnFocusTo={triggerRef} />
      )}
    </>
  )
}
