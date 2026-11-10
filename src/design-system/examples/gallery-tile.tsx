import { GalleryTile } from "@/components/page/gallery-tile"
import { getSource } from "@/lib/content/source"

/** Kafle galerii portfolio w dwóch kolumnach (`columns-2`), kadry w naturalnych proporcjach. */
export function GalleryTileExample() {
  const { groups, common, copy } = getSource("pl")
  const works = groups.find((group) => group.id === "wideo")?.works.slice(0, 2) ?? []
  const labels = { newTab: common.ui.newTab, play: copy.ui.playVideo, pause: copy.ui.pauseVideo }

  return (
    <div className="w-full gap-6 sm:columns-2">
      {works.map((work) => (
        <GalleryTile key={work.slug} work={work} labels={labels} />
      ))}
    </div>
  )
}
