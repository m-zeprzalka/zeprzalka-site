import { Fragment, type CSSProperties, type ElementType } from "react"
import { typo } from "../forma/typo"

/**
 * Tekst, którego słowa wyostrzają się po kolei, gdy wejdzie w kadr (`Appear`
 * dopisuje `data-in`) — ten sam ruch co H1 hero, tylko spokojniejszy (900 ms,
 * co 55 ms). Komponent serwerowy; bez JS zwykły, widoczny tekst.
 */
export function BlurWords({
  as: Tag = "span",
  text,
  className,
  id,
}: {
  as?: ElementType
  text: string
  className?: string
  id?: string
}) {
  const words = typo(text).split(" ")
  return (
    <Tag id={id} className={className} data-bo-words="">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={index}>
            <span className="bo-w" style={{ "--i": index } as CSSProperties}>
              {word}
            </span>
            {index < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </Tag>
  )
}
