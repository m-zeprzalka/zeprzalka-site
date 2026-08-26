import { Reveal } from "@/components/main-secondary/Reveal"
import { Section, SectionHeader } from "@/components/main-secondary/Section"
import { SmartVideo } from "@/components/media/SmartVideo"
import { portfolio, sections } from "@/lib/home-content"

export function Portfolio() {
  return (
    <Section meta={sections.portfolio}>
      <SectionHeader meta={sections.portfolio} />

      <ul className="columns-1 gap-4 sm:columns-2 md:gap-6 xl:columns-3 [&>li]:mb-4 [&>li]:break-inside-avoid md:[&>li]:mb-6">
        {portfolio.map((item, i) => (
          <Reveal as="li" key={item.id} delay={(i % 3) * 70}>
            <figure className="group flex flex-col gap-3">
              <SmartVideo
                sources={[{ src: item.src, type: "video/mp4" }]}
                poster={item.poster}
                aspect={item.aspect}
                label={item.title}
                sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="rounded-lg md:rounded-xl"
                mediaClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
              />
              <figcaption className="ms-caption">
                <h3>{item.title}</h3>
                <span>{item.category}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
