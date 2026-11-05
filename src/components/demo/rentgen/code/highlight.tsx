/**
 * Podświetlanie składni warstwy kodu — mały, przewidywalny tokenizer JSX/TS
 * liczony na serwerze (do przeglądarki trafia gotowy HTML ze spanami).
 * Rozpoznaje to, czego używają bliźniaki sekcji: znaczniki i komponenty,
 * atrybuty, ciągi, wyrażenia w klamrach, tekst JSX, słowa kluczowe,
 * liczby i komentarze. Paleta jest monochromatyczna (rentgen), rola tokenu
 * = ton szarości w `rentgen.css` (`.rg-t-*`).
 */

export type TokenKind =
  "tag" | "attr" | "str" | "text" | "punct" | "kw" | "num" | "com" | "prop" | "fn" | "plain"

interface Token {
  kind: TokenKind
  value: string
}

const KEYWORDS = new Set([
  "const",
  "let",
  "export",
  "default",
  "function",
  "return",
  "import",
  "from",
  "await",
  "async",
  "new",
  "true",
  "false",
  "null",
  "as",
  "type",
  "interface",
  "satisfies",
])

type Mode = "js" | "tag" | "children" | "close"

/** Czy w tym miejscu kodu JS może zacząć się JSX (po `(`, `=`, `return`…). */
function jsxCanStart(tokens: Token[]): boolean {
  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i]
    if (!token) break
    if (token.kind === "plain" && token.value.trim() === "") continue
    if (token.kind === "kw") return token.value === "return" || token.value === "default"
    if (token.kind === "punct") return /[(=,?:&|[{>]$/.test(token.value)
    return false
  }
  return true
}

export function tokenize(source: string, start: "js" | "children" = "js"): Token[] {
  const tokens: Token[] = []
  const stack: { mode: Mode; depth: number }[] = [{ mode: start, depth: 0 }]
  let i = 0
  const push = (kind: TokenKind, value: string) => {
    const last = tokens[tokens.length - 1]
    if (last && last.kind === kind && (kind === "text" || kind === "plain")) last.value += value
    else tokens.push({ kind, value })
  }
  const top = () => stack[stack.length - 1] ?? { mode: "js" as Mode, depth: 0 }

  while (i < source.length) {
    const frame = top()
    const ch = source[i] ?? ""
    const rest = source.slice(i)

    if (frame.mode === "children") {
      if (rest.startsWith("</")) {
        stack.push({ mode: "close", depth: 0 })
        push("punct", "</")
        i += 2
        continue
      }
      if (ch === "<" && /[A-Za-z>]/.test(source[i + 1] ?? "")) {
        stack.push({ mode: "tag", depth: 0 })
        push("punct", "<")
        i += 1
        continue
      }
      if (ch === "{") {
        stack.push({ mode: "js", depth: 0 })
        push("punct", "{")
        i += 1
        continue
      }
      const end = rest.search(/[<{]/)
      const text = end === -1 ? rest : rest.slice(0, end)
      push("text", text)
      i += text.length
      continue
    }

    if (frame.mode === "tag" || frame.mode === "close") {
      if (/\s/.test(ch)) {
        push("plain", ch)
        i += 1
        continue
      }
      if (rest.startsWith("/>")) {
        push("punct", "/>")
        stack.pop()
        i += 2
        continue
      }
      if (ch === ">") {
        push("punct", ">")
        stack.pop()
        // Znacznik otwierający przechodzi w dzieci; zamykający kończy dzieci rodzica.
        if (frame.mode === "tag") stack.push({ mode: "children", depth: 0 })
        else if (top().mode === "children") stack.pop()
        i += 1
        continue
      }
      if (ch === "{") {
        stack.push({ mode: "js", depth: 0 })
        push("punct", "{")
        i += 1
        continue
      }
      if (ch === '"' || ch === "'") {
        const close = source.indexOf(ch, i + 1)
        const value = source.slice(i, close === -1 ? source.length : close + 1)
        push("str", value)
        i += value.length
        continue
      }
      const word = rest.match(/^[A-Za-z_$][\w$.:-]*/)?.[0]
      if (word) {
        const prev = tokens[tokens.length - 1]
        const isName = prev?.kind === "punct" && (prev.value === "<" || prev.value === "</")
        push(isName ? "tag" : "attr", word)
        i += word.length
        continue
      }
      push("punct", ch)
      i += 1
      continue
    }

    // Tryb JS (także wyrażenia w klamrach).
    if (rest.startsWith("//")) {
      const end = rest.indexOf("\n")
      const value = end === -1 ? rest : rest.slice(0, end)
      push("com", value)
      i += value.length
      continue
    }
    if (rest.startsWith("/*")) {
      const end = rest.indexOf("*/")
      const value = end === -1 ? rest : rest.slice(0, end + 2)
      push("com", value)
      i += value.length
      continue
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      let j = i + 1
      while (j < source.length && source[j] !== ch) j += source[j] === "\\" ? 2 : 1
      const value = source.slice(i, j + 1)
      push("str", value)
      i += value.length
      continue
    }
    if (ch === "<" && /[A-Za-z>]/.test(source[i + 1] ?? "") && jsxCanStart(tokens)) {
      stack.push({ mode: "tag", depth: 0 })
      push("punct", "<")
      i += 1
      continue
    }
    if (ch === "{" || ch === "(" || ch === "[") {
      frame.depth += 1
      push("punct", ch)
      i += 1
      continue
    }
    if (ch === "}" || ch === ")" || ch === "]") {
      if (ch === "}" && frame.depth === 0 && stack.length > 1) {
        stack.pop()
        push("punct", ch)
        i += 1
        continue
      }
      frame.depth = Math.max(0, frame.depth - 1)
      push("punct", ch)
      i += 1
      continue
    }
    const number = rest.match(/^\d[\d_.,]*/)?.[0]
    if (number && !/[\w$]/.test(source[i - 1] ?? "")) {
      // Przecinek na końcu to separator listy, nie część liczby.
      const value = number.replace(/[,.]+$/, "")
      push("num", value)
      i += value.length
      continue
    }
    const word = rest.match(/^[A-Za-z_$ąćęłńóśźżĄĆĘŁŃÓŚŹŻ][\w$ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*/)?.[0]
    if (word) {
      const after = source.slice(i + word.length).match(/^\s*(.)/)?.[1]
      const kind: TokenKind = KEYWORDS.has(word)
        ? "kw"
        : after === ":" && !/\?\s*$/.test(source.slice(0, i))
          ? "prop"
          : after === "("
            ? "fn"
            : "plain"
      push(kind, word)
      i += word.length
      continue
    }
    if (/\s/.test(ch)) {
      push("plain", ch)
      i += 1
      continue
    }
    push("punct", ch)
    i += 1
  }
  return tokens
}

/** Krótkie klasy tokenów (tysiące spanów w kliszy — każdy bajt HTML się liczy). */
const CLASS: Record<Exclude<TokenKind, "plain">, string> = {
  tag: "rg-t-g",
  fn: "rg-t-g",
  attr: "rg-t-a",
  prop: "rg-t-a",
  kw: "rg-t-a",
  str: "rg-t-s",
  text: "rg-t-x",
  punct: "rg-t-p",
  num: "rg-t-n",
  com: "rg-t-c",
}

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

/**
 * Kod z podświetleniem jako gotowy HTML (spany z klasami `rg-t-*`) — jeden ciąg
 * zamiast tysięcy węzłów Reacta: ładunek RSC i HTML zostają lekkie. Treść
 * pochodzi wyłącznie z naszego tokenizera, każdy token jest escapowany.
 */
export function highlightHtml(source: string, start: "js" | "children" = "js"): string {
  return tokenize(source, start)
    .map((token) =>
      token.kind === "plain"
        ? escape(token.value)
        : `<span class="${CLASS[token.kind]}">${escape(token.value)}</span>`
    )
    .join("")
}

/** Tekst do wstawienia w JSX: cudzysłowy i klamry zamienione na encje, jak robi to formatter. */
export function jsxText(text: string): string {
  return text.replace(/[{}]/g, (char) => (char === "{" ? "&#123;" : "&#125;"))
}

/** Ciąg w cudzysłowie (do atrybutów i obiektów danych). */
export function quote(text: string): string {
  return `"${text.replace(/"/g, '\\"')}"`
}
