import { Frame } from "@/components/demo/main-third/Frame"
import { PortfolioStrip } from "@/components/demo/main-third/PortfolioStrip"
import { sections } from "@/components/demo/shared/home-content"

export function Portfolio() {
  return (
    <Frame meta={sections.portfolio}>
      <PortfolioStrip />
    </Frame>
  )
}
