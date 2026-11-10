import { WorkList } from "@/components/sections/work-list"
import { getHomeContent } from "@/lib/content/home"

/** Grupa „Strony i aplikacje” — dowody kompetencji wyżej otwierają jej wiersze (`#realizacja-…`). */
export function WorkListExample() {
  const { work } = getHomeContent("pl")
  const groups = work.groups.filter((group) => group.id === "web")

  return (
    <div className="w-full">
      <WorkList groups={groups} all={work.all} labels={work.labels} />
    </div>
  )
}
