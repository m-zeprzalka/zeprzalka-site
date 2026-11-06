/**
 * Znaki sygnetu — ten sam zestaw co w obecnym logo serwisu. Jedno źródło dla
 * logo i dekodowania napisów (`GlyphText`); wszystkie są w krojach `font-logo`.
 */
export const GLYPHS = Array.from(
  "⍤⍨⍫⍮⍯⍰⍲⍳⍴⍵⍶⍷⍸⍹⍺⍻⍼⍽⍾⍿⎈⎇⎋⎌⎍⎎⎏⎄⎅⎆⎊⎉⎂⎃⎀⎁⋇⋉⋊⋋⋌⋍⋎⋏⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿⌀⍂⍙⍚⍛⍜⍝⍞⍠⍡⍢⍣⍦⍧⍩⍪⍬⍭⧫⧬⧭⧮⧯⧰⧱⧲⧳⧴⧵⧶⧷⧸⧹⧺⧻⧼⧽⧾⧿⨀⨁⨂⨃⨄⨅⨆⨇⨈⨉⨊⨋⨌⨍⨎⨏⨐⨑⨒⨓⨔⨕⨖⨗⨘⨙⨚⨛⨜⨝⨞⨟"
)

/** Znak startowy logo — stały, więc HTML z serwera i pierwszy render klienta są identyczne. */
export const START_GLYPH = "⨝"

export function randomGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? START_GLYPH
}
