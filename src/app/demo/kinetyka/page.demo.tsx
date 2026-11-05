import { KinetykaHome } from "@/components/demo/kinetyka/KinetykaHome"
import { demoMetadata } from "@/components/demo/registry"

export const metadata = demoMetadata("kinetyka")

export default function Page() {
  return <KinetykaHome />
}
