import { TryptykHome } from "@/components/demo/tryptyk/TryptykHome"
import { demoMetadata } from "@/components/demo/registry"

export const metadata = demoMetadata("tryptyk")

export default function Page() {
  return <TryptykHome />
}
