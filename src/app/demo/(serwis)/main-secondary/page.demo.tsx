import { Demo } from "@/components/demo/main-secondary/Page"
import { demoMetadata } from "@/components/demo/registry"

export const metadata = demoMetadata("main-secondary")

export default function Page() {
  return <Demo />
}
