import { Fragment } from "react"

/**
 * Tekst pocięty na litery (`data-c`) do dekodowania — spacje zostają zwykłymi
 * znakami (łamanie wierszy jak w oryginale), wyrazy się nie rozpadają. Bez JS
 * to po prostu tekst.
 */
export function Letters({ text }: { text: string }) {
  const words = text.split(" ")
  return (
    <>
      {words.map((word, w) => (
        <Fragment key={w}>
          <span className="whitespace-nowrap">
            {Array.from(word).map((char, i) => (
              <span key={i} data-c="">
                {char}
              </span>
            ))}
          </span>
          {w < words.length - 1 && " "}
        </Fragment>
      ))}
    </>
  )
}
