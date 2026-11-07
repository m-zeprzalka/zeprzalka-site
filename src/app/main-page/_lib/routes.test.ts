import assert from "node:assert/strict"
import { test } from "node:test"
import {
  BASE,
  blogPageHref,
  categoryHref,
  homeAnchor,
  pageHref,
  postHref,
  withBase,
} from "./routes"

test("withBase dokleja prefiks podglądu (start bez ukośnika na końcu)", () => {
  assert.equal(withBase("/"), BASE)
  assert.equal(withBase("/uslugi"), `${BASE}/uslugi`)
})

test("adresy podstron, wpisów i archiwum idą przez mapę ROUTES", () => {
  assert.equal(pageHref("services", "pl"), `${BASE}/uslugi`)
  assert.equal(postHref("pl", "html"), `${BASE}/blog/html`)
  assert.equal(categoryHref("pl", "ai"), `${BASE}/blog/kategoria/ai`)
  assert.equal(blogPageHref("pl", 1), `${BASE}/blog`)
  assert.equal(blogPageHref("pl", 3), `${BASE}/blog/strona/3`)
})

test("homeAnchor prowadzi do sekcji startu z każdej podstrony", () => {
  assert.equal(homeAnchor("pl", "kontakt"), `${BASE}#kontakt`)
})
