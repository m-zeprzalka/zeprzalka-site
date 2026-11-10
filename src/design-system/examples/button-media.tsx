import Image from "next/image"
import { PlayIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ButtonMediaExample() {
  return (
    // Kadr nie zmienia się z motywem — kontrolka na nim też nie (`variant="media"`). Każda
    // stoi 12 px od krawędzi kadru: odtwarzanie w prawym dolnym rogu, zamknięcie w prawym górnym.
    <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-xl bg-print">
      <Image
        src="/hero-poster.webp"
        alt=""
        width={1080}
        height={606}
        sizes="24rem"
        className="size-full object-cover"
      />
      <Button
        variant="media"
        size="icon"
        aria-label="Zamknij kartę"
        className="absolute top-3 right-3"
      >
        <XIcon />
      </Button>
      <Button
        variant="media"
        size="icon"
        aria-label="Odtwórz"
        className="absolute right-3 bottom-3"
      >
        <PlayIcon />
      </Button>
    </div>
  )
}
