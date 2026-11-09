import Image from "next/image"
import { PauseIcon, PlayIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"

export function ButtonMediaExample() {
  return (
    // Kadr nie zmienia się z motywem — kontrolka na nim też nie (`variant="media"`).
    <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-xl bg-print">
      <Image
        src="/hero-poster.webp"
        alt=""
        width={1080}
        height={606}
        sizes="24rem"
        className="size-full object-cover"
      />
      <div className="absolute right-3 bottom-3 flex gap-2">
        <Button variant="media" size="icon" aria-label="Odtwórz">
          <PlayIcon />
        </Button>
        <Button variant="media" size="icon" aria-label="Zatrzymaj">
          <PauseIcon />
        </Button>
      </div>
    </div>
  )
}
