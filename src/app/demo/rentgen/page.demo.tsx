import { RentgenHome } from "@/components/demo/rentgen/RentgenHome"
import { demoMetadata } from "@/components/demo/registry"

export const metadata = demoMetadata("rentgen")

export default function Page() {
  return <RentgenHome />
}
