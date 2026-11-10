import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function KbdExample() {
  return (
    <>
      {/* Skrót tej platformy: ⌘ albo Ctrl wybiera `data-os` na <html> (skrypt przed malowaniem). */}
      <KbdGroup>
        <Kbd>
          <span className="in-data-[os=other]:hidden">⌘</span>
          <span className="hidden in-data-[os=other]:inline">Ctrl</span>
        </Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
      </KbdGroup>
      <Kbd>↵</Kbd>
      <Kbd>esc</Kbd>
    </>
  )
}
