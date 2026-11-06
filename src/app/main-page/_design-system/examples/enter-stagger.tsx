import { Segments } from "@/app/main-page/_components/peek/segments"

export function EnterStaggerExample() {
  return (
    <p className="text-2xl font-medium tracking-tight">
      {/* Słowa jako inline-block z indeksem --i; start i krok ustawia rodzic. */}
      <span className="enter-stagger [--enter-delay:0ms] [--enter-step:40ms]">
        <Segments segments={[{ text: "Słowa wyostrzają się jedno po drugim." }]} split="block" />
      </span>
    </p>
  )
}
