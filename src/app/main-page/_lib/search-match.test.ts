import assert from "node:assert/strict"
import { test } from "node:test"
import { fold, matchScore } from "./search-match"

test("porównanie bez wielkości liter i polskich znaków", () => {
  assert.equal(fold("Łódź Żółć"), "lodz zolc")
  assert.ok(matchScore("zolc", "Żółć") > 0)
})

test("nazwa od początku > początek słowa > środek słowa > opis", () => {
  const css = matchScore("css", "CSS od podstaw")
  const word = matchScore("css", "Nowoczesny CSS")
  const inside = matchScore("css", "SCSS w praktyce")
  const detail = matchScore("css", "Next.js + Shadcn UI", ["Tailwind CSS i komponenty"])
  assert.ok(css > word && word > inside && inside > detail && detail > 0)
})

test("litery w rozsypce nie pasują", () => {
  assert.equal(
    matchScore("css", "Claude Design — czy zastąpi Figmę?", ["Sprawdzam na kilku przykładach"]),
    0
  )
})

test("każde słowo zapytania musi się znaleźć", () => {
  assert.ok(matchScore("blog css", "CSS od podstaw", ["Blog"]) > 0)
  assert.equal(matchScore("css python", "CSS od podstaw"), 0)
})

test("puste zapytanie pasuje do wszystkiego", () => {
  assert.equal(matchScore("  ", "Cokolwiek"), 1)
})
