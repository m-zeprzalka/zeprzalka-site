"use client"

/**
 * Pomiar bliźniaków: każdy `[data-rg-for]` w kliszy dostaje pozycję i rozmiar
 * oryginału (`[data-rg-key]`) względem gospodarza kliszy. Liczone z `offset*`
 * (układ bez transformacji) — wejścia z rozmycia i skala wideo nie przesuwają
 * bliźniaków; transformacje, które mają je obejmować, bliźniak dostaje tą
 * samą klasą CSS.
 */

function offsetWithin(element: HTMLElement, host: HTMLElement) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = element
  while (node && node !== host) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
    if (node && node !== host && !host.contains(node)) node = null
  }
  // Gospodarz jest pozycjonowany, więc łańcuch `offsetParent` zwykle do niego dochodzi;
  // wyjątek (np. element w `position: fixed`) — prostokąty z ekranu.
  if (node === host) return { x, y }
  const a = element.getBoundingClientRect()
  const b = host.getBoundingClientRect()
  return { x: a.left - b.left, y: a.top - b.top }
}

const sizeFormat = (value: number) => Math.round(value).toString()

export function layoutTwins(face: HTMLElement) {
  const host = face.closest<HTMLElement>("[data-rg-host]")
  if (!host) return
  const twins = face.querySelectorAll<HTMLElement>("[data-rg-for]")
  for (const twin of twins) {
    const key = twin.dataset.rgFor
    if (!key) continue
    const source =
      host.dataset.rgHost === key
        ? host
        : host.querySelector<HTMLElement>(`[data-rg-key="${CSS.escape(key)}"]`)
    if (!source || source.offsetParent === null) {
      twin.style.display = "none"
      continue
    }
    const { x, y } = source === host ? { x: 0, y: 0 } : offsetWithin(source, host)
    const width = source.offsetWidth
    const height = source.offsetHeight
    twin.style.display = ""
    twin.style.left = `${x}px`
    twin.style.top = `${y}px`
    twin.style.width = `${width}px`
    twin.style.height = `${height}px`
    const size = twin.querySelector<HTMLElement>(":scope > .rg-tag [data-rg-size]")
    if (size) size.textContent = `${sizeFormat(width)} × ${sizeFormat(height)}`
  }
}
