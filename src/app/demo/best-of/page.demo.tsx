import { BestOfHome } from "@/components/demo/best-of/BestOfHome"
import { demoMetadata } from "@/components/demo/registry"

export const metadata = demoMetadata("best-of")

export default function Page() {
  return <BestOfHome />
}
