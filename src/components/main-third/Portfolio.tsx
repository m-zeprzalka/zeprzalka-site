import { Frame } from "@/components/main-third/Frame"
import { PortfolioStrip } from "@/components/main-third/PortfolioStrip"
import { sections } from "@/lib/home-content"

export function Portfolio() {
  return (
    <Frame meta={sections.portfolio}>
      <PortfolioStrip />
    </Frame>
  )
}
