import { SkillList } from "@/app/main-page/_components/sections/skill-list"
import { getHomeContent } from "@/app/main-page/_lib/content/home"

/** Prawdziwe kompetencje startu: dowody to kotwice realizacji niżej i wpisy bloga. */
export function SkillListExample() {
  const { skills } = getHomeContent("pl")

  return (
    <div className="w-full">
      <SkillList items={skills.items.slice(0, 2)} />
    </div>
  )
}
