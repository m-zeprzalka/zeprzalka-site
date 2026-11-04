import { EsencjaHome } from "@/components/demo/esencja/EsencjaHome"
import { demoMetadata } from "@/components/demo/registry"

export const metadata = demoMetadata("esencja")

export default function Page() {
  return <EsencjaHome />
}
