import "react"

/** Zmienne CSS w `style` (`--i`, `--n`…) bez rzutowania na `CSSProperties`. */
declare module "react" {
  interface CSSProperties {
    [variable: `--${string}`]: string | number | undefined
  }
}
