import type { CSSProperties } from "react"
import { typo } from "../../forma/typo"
import type { DemoHomeContent, DemoWork } from "../../shared/content"
import { MediaTwin } from "../ascii/MediaTwin"
import { Listing } from "../code/Listing"
import { quote } from "../code/highlight"
import { Code, Face, Outline, Tag, Twin } from "../code/Twin"
import { UI } from "../ui"
import { VideoTile } from "./VideoTile"

const vars = (values: Record<string, string | number>) => values as CSSProperties

/** Wysokości kafli w rzędach siatki (masonry bez JS): różne, żeby kolumny się mijały. */
const SPANS = [30, 23, 34, 25, 31, 22, 27] as const

/**
 * Wideo i animacja: masonry z siatki — każdy kafel zajmuje inną liczbę
 * rzędów, a automatyczne rozmieszczenie (`dense`) układa je w kolumnach
 * na przemian. Kadr wypełnia swoją wysokość (object-cover), więc nic nie
 * trzeba mierzyć. Pod soczewką każdy klip to żywy obraz z cyfr
 * 0/1 — najechanie odtwarza wideo, a shader bierze klatki prosto z niego.
 */
export function Videos({
  group,
  works,
}: {
  group: DemoHomeContent["portfolio"]["groups"][number]
  works: readonly DemoWork[]
}) {
  return (
    <section
      id="wideo"
      data-rg-host="videos"
      data-rg-section="wideo"
      data-rg-name="section#wideo"
      aria-labelledby="rg-videos-title"
      className="relative pt-20 pb-(--fm-section) sm:pt-24"
    >
      <div className="fm-container">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="rg-videos-title"
            data-rg-key="videos-title"
            data-rg-name="h3"
            data-rg-in=""
            className="text-[1.625rem] leading-[1.1] font-[560] tracking-[-0.035em] sm:text-[2rem]"
          >
            {group.label}
          </h2>
          <p
            data-rg-key="videos-lead"
            data-rg-in=""
            style={vars({ "--i": 1 })}
            className="max-w-[26rem] text-fm-body text-pretty text-fm-ink-2"
          >
            {typo(group.description)}
          </p>
        </div>

        <ul className="rg-masonry mt-10">
          {works.map((work, index) => (
            <li
              key={work.slug}
              data-rg-in=""
              style={vars({ "--i": index % 3, "--rg-span": SPANS[index % SPANS.length] ?? 26 })}
            >
              {work.video && (
                <VideoTile
                  slug={work.slug}
                  title={work.title}
                  category={work.category}
                  poster={work.poster}
                  video={work.video}
                  width={work.width}
                  height={work.height}
                  labels={UI.video}
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      <Face>
        <Listing file="Videos.tsx" />
        <Outline
          for="videos-title"
          tag="h2"
          label="<h2>"
          classes="text-[1.625rem] leading-[1.1] font-[560] tracking-[-0.035em] sm:text-[2rem]"
          text={group.label}
        />
        <Twin for="videos-lead" kind="text">
          <Code className="rg-code--body" src={`description: ${quote(group.description)}`} />
        </Twin>
        {works.map((work) => (
          <Twin
            key={work.slug}
            for={`video-media-${work.slug}`}
            kind="media"
            className="rounded-fm-2xl"
          >
            <MediaTwin source={`video-media-${work.slug}`} cell={5} tone={0.08} />
            <Tag name="video" />
            <Code className="rg-media-caption" src={`<video src="${work.video ?? ""}" />`} />
          </Twin>
        ))}
      </Face>
    </section>
  )
}
