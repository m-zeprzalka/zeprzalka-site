import assert from "node:assert/strict"
import { test } from "node:test"
import { lowerFirst, noOrphans, segment, sentences } from "./text"

const NBSP = "\u00A0"

test("noOrphans skleja cały łańcuch jednoliterowych słów", () => {
  assert.equal(noOrphans("i w domu"), `i${NBSP}w${NBSP}domu`)
  assert.equal(noOrphans("W domu i w pracy"), `W${NBSP}domu i${NBSP}w${NBSP}pracy`)
})

test("noOrphans nie odrywa liczby od jednostki", () => {
  assert.equal(noOrphans("w 24 godziny"), `w${NBSP}24${NBSP}godziny`)
  assert.equal(noOrphans("kawa i"), "kawa i")
})

test("segment dzieli tekst na zwykłe fragmenty i frazy kart", () => {
  const text = "Projektuję rozwiązania webowe i multimedialne."
  assert.deepEqual(segment(text, { web: "webowe", motion: "multimedialne" }), [
    { text: "Projektuję rozwiązania " },
    { text: "webowe", peek: "web" },
    { text: " i " },
    { text: "multimedialne", peek: "motion" },
    { text: "." },
  ])
})

test("segment szuka fraz jako całych słów", () => {
  assert.deepEqual(segment("a website and web", { web: "web" }), [
    { text: "a website and " },
    { text: "web", peek: "web" },
  ])
})

test("segment zatrzymuje build przy brakującej albo nachodzącej frazie", () => {
  assert.throws(() => segment("abc", { x: "zzz" }), /nie występuje/)
  assert.throws(() => segment("ala ma kota", { a: "ala ma", b: "ma kota" }), /nachodzi/)
})

test("sentences dzieli akapit po kropce, wykrzykniku i pytajniku", () => {
  assert.deepEqual(sentences(" Raz. Dwa! Trzy? "), ["Raz.", "Dwa!", "Trzy?"])
})

test("lowerFirst zmniejsza tylko pierwszą literę", () => {
  assert.equal(lowerFirst("Umiejętności AI"), "umiejętności AI")
})
