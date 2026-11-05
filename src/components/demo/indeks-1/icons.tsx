import {
  ArrowUpRight,
  BrainCircuit,
  Clapperboard,
  CodeXml,
  Copy,
  FileText,
  GraduationCap,
  Hash,
  History,
  Mail,
  MonitorSmartphone,
  PenTool,
  PlaySquare,
  SquareArrowOutUpRight,
  SunMoon,
  type LucideIcon,
} from "lucide-react"
import type { IconName } from "./types"

/** Nazwy ikon z serwera → komponenty lucide (komponentu nie da się przekazać przez granicę RSC). */
export const ICONS: Record<IconName, LucideIcon> = {
  design: PenTool,
  code: CodeXml,
  ai: BrainCircuit,
  teaching: GraduationCap,
  history: History,
  web: MonitorSmartphone,
  motion: Clapperboard,
  section: Hash,
  work: PlaySquare,
  post: FileText,
  mail: Mail,
  external: ArrowUpRight,
  theme: SunMoon,
  copy: Copy,
  page: SquareArrowOutUpRight,
}
