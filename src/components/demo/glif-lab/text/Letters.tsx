import { Fragment } from "react"

/**
 * Tekst pocięty na litery (`data-c`) do dekodowania — spacje i twarde spacje
 * zostają zwykłymi znakami (łamanie wierszy jak w oryginale). Bez JS to po
 * prostu tekst.
 */
export function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, w, words) => (
        <Fragment key={w}>
          <span className="whitespace-nowrap">
            {Array.from(word).map((char, i) =>
              char === " " ? (
                char
              ) : (
                <span key={i} data-c="">
                  {char}
                </span>
              )
            )}
          </span>
          {w < words.length - 1 && " "}
        </Fragment>
      ))}
    </>
  )
}
