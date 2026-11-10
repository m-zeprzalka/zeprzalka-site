import assert from "node:assert/strict"
import { test } from "node:test"
import { joinProjectTypes, splitProjectTypes } from "./contact-fields"

test("jedno pole tekstowe serwisu — ta sama wartość (bez spacji na brzegach)", () => {
  assert.equal(joinProjectTypes(["  Strona / sklep  "]), "Strona / sklep")
  assert.equal(joinProjectTypes([""]), "")
  assert.equal(joinProjectTypes([]), "")
})

test("kilka zaznaczonych pigułek — jedna lista, puste pomijane", () => {
  assert.equal(joinProjectTypes(["Animacja", " ", "Inny"]), "Animacja, Inny")
})

test("plik zamiast tekstu nie trafia do listy", () => {
  assert.equal(joinProjectTypes([new File(["x"], "x.txt"), "Grafika"]), "Grafika")
})

test("lista wraca jako zaznaczenia", () => {
  assert.deepEqual(splitProjectTypes(joinProjectTypes(["Strona internetowa", "Inny"])), [
    "Strona internetowa",
    "Inny",
  ])
  assert.deepEqual(splitProjectTypes(""), [])
  assert.deepEqual(splitProjectTypes(undefined), [])
})
