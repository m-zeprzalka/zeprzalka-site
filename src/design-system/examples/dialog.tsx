"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

/** Plik kliencki z tego samego powodu co popover — `asChild` z dzieckiem z klienta. */
export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Otwórz okno</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Okno dialogowe</DialogTitle>
          <DialogDescription>
            Bez krzyżyka: zamyka je Escape, kliknięcie obok albo przycisk. Fokus wraca na przycisk,
            który je otworzył.
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button className="w-fit">Zamknij</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
