/*
 * Zamiar najechania (hover intent) dla kafli z wideo. Najechanie liczy się po ~120 ms
 * spokoju kursora nad kaflem. Kafel, który wjechał pod NIERUCHOMY kursor w trakcie
 * przewijania, nie jest najechany, dopóki mysz naprawdę się nie poruszy — samo
 * przewijanie kółkiem nie pobiera klipów. Dotyk nie przechodzi tędy wcale.
 */

let lastScroll = 0
if (typeof window !== "undefined") {
  window.addEventListener("scroll", () => (lastScroll = performance.now()), {
    passive: true,
    capture: true,
  })
}

export function hoverIntent(
  host: HTMLElement,
  onEnter: (event: PointerEvent) => void,
  onLeave: (event: PointerEvent) => void,
  delay = 120
) {
  let timer: ReturnType<typeof setTimeout> | undefined
  let inside = false
  let active = false
  let since = 0
  let last: PointerEvent | null = null

  const fire = () => {
    timer = undefined
    if (!inside || active || !last) return
    // Przewijanie w trakcie odliczania — to nie zamiar; czekamy na ruch myszy.
    if (lastScroll > since - 40) return
    active = true
    onEnter(last)
  }
  const arm = () => {
    clearTimeout(timer)
    since = performance.now()
    timer = setTimeout(fire, delay)
  }
  const enter = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return
    inside = true
    last = event
    arm()
  }
  const move = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || !inside || active) return
    last = event
    if (event.movementX === 0 && event.movementY === 0) return
    if (performance.now() - lastScroll < 100) return
    if (!timer) arm()
  }
  const leave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return
    inside = false
    clearTimeout(timer)
    timer = undefined
    if (!active) return
    active = false
    onLeave(event)
  }
  host.addEventListener("pointerenter", enter)
  host.addEventListener("pointermove", move)
  host.addEventListener("pointerleave", leave)
  return () => {
    clearTimeout(timer)
    host.removeEventListener("pointerenter", enter)
    host.removeEventListener("pointermove", move)
    host.removeEventListener("pointerleave", leave)
  }
}
