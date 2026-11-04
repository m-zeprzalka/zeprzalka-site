import {
  ArrowUpRight,
  Clapperboard,
  CodeXml,
  FileText,
  Hash,
  History,
  Mail,
  MonitorSmartphone,
  PenTool,
  PlaySquare,
  SunMoon,
  type LucideIcon,
} from "lucide-react"
import type { IconName } from "./types"

/** Nazwy ikon z serwera → komponenty lucide (komponentu nie da się przekazać przez granicę RSC). */
export const ICONS: Record<IconName, LucideIcon> = {
  design: PenTool,
  code: CodeXml,
  motion: Clapperboard,
  history: History,
  web: PlaySquare,
  section: Hash,
  page: MonitorSmartphone,
  post: FileText,
  mail: Mail,
  external: ArrowUpRight,
  theme: SunMoon,
}
