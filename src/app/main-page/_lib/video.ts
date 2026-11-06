/**
 * Zapętlony klip gra tylko w kadrze: poza nim pauza (bez dekodowania i baterii
 * na darmo), po powrocie gra dalej — chyba że użytkownik zatrzymał go sam
 * (`pausedByUser`). Zwraca funkcję sprzątającą.
 */
export function playInView(video: HTMLVideoElement, pausedByUser: () => boolean = () => false) {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry) return
    if (!entry.isIntersecting) video.pause()
    else if (video.paused && !pausedByUser()) video.play().catch(() => {})
  })
  observer.observe(video)
  return () => observer.disconnect()
}
