/**
 * Pasek postępu czytania — sam CSS, bez JavaScriptu w przeglądarce.
 *
 * Wypełnienie skaluje się w poziomie animacją sprzężoną z przewijaniem
 * dokumentu (`animation-timeline: scroll()`, globals.css). Skala zamiast
 * szerokości: tylko kompozytor, zero przeliczania układu, a gradient wygląda
 * tak samo jak przy zmianie szerokości. Przeglądarka bez animacji przewijania
 * pokazuje pusty pasek.
 */
export function ReadingProgress() {
  return (
    <div aria-hidden="true" data-print-hide className="sticky top-0 z-60 h-1 surface-glass">
      <div className="reading-progress h-full origin-left scale-x-0 bg-linear-to-r from-primary/20 to-primary" />
    </div>
  )
}
