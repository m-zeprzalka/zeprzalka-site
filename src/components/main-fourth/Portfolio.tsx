import { Reveal } from "@/components/main-fourth/Reveal"
import { Section, SectionHead } from "@/components/main-fourth/Section"
import { SmartVideo } from "@/components/media/SmartVideo"
import { portfolio, sections } from "@/lib/home-content"

const pad = (value: number) => String(value + 1).padStart(2, "0")

/**
 * Portfolio jako rozkładówka: dwie kolumny przesunięte względem siebie
 * w pionie, materiał w naturalnych proporcjach, podpis pod kadrem.
 * Delikatna paralaksa (sterowana osią przewijania) rozrusza siatkę,
 * nie ruszając czytelności.
 */
export function Portfolio() {
  return (
    <Section meta={sections.portfolio}>
      <SectionHead meta={sections.portfolio} />

      <ul className="m4-gallery">
        {portfolio.map((item, index) => (
          <Reveal as="li" key={item.id} variant="fade" className="m4-work">
            <figure>
              <SmartVideo
                sources={[{ src: item.src, type: "video/mp4" }]}
                poster={item.poster}
                aspect={item.aspect}
                label={item.title}
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="m4-work-media"
                mediaClassName="m4-work-video"
              />
              <figcaption className="m4-work-caption">
                <span className="m4-numeral">{pad(index)}</span>
                <span className="m4-work-text">
                  <h3>{item.title}</h3>
                  <span className="m4-meta">{item.category}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
