import { Demo } from "@/components/demo/main-third/Page"
import { demoMetadata } from "@/components/demo/registry"

export const metadata = demoMetadata("main-third")

export default function Page() {
  return <Demo />
}
