// Osobny moduł, żeby bundler wydzielił cechy Motion do własnego chunka
// ładowanego po pierwszym renderze. domMax, bo talia potrzebuje przeciągania
// (stos, szuflada) i animacji układu (tasowanie, menu, przycisk wysyłki).
import { domMax } from "motion/react"

export default domMax
