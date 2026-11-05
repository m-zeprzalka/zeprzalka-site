/** Korzeń koncepcji — portale (menu, projekcja) renderują się w nim, bo tam żyją tokeny. */
export const ROOT_ID = "kn-root"

export function portalRoot(): HTMLElement | undefined {
  return typeof document === "undefined"
    ? undefined
    : (document.getElementById(ROOT_ID) ?? undefined)
}
