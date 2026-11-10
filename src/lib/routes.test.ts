import assert from "node:assert/strict"
import { test } from "node:test"
import { blogPageHref, categoryHref, homeAnchor, pageHref, postHref } from "./routes"

test("adresy podstron, wpisów i archiwum idą przez mapę ROUTES", () => {
  assert.equal(pageHref("services", "pl"), "/uslugi")
  assert.equal(pageHref("services", "en"), "/en/services")
  assert.equal(postHref("pl", "html"), "/blog/html")
  assert.equal(categoryHref("pl", "ai"), "/blog/kategoria/ai")
  assert.equal(blogPageHref("pl", 1), "/blog")
  assert.equal(blogPageHref("pl", 3), "/blog/strona/3")
  assert.equal(blogPageHref("en", 2), "/en/blog/page/2")
})

test("homeAnchor prowadzi do sekcji startu z każdej podstrony", () => {
  assert.equal(homeAnchor("pl", "kontakt"), "/#kontakt")
  assert.equal(homeAnchor("en", "kontakt"), "/en#kontakt")
})
