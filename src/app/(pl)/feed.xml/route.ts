import { FEED_HEADERS, buildFeed } from "@/lib/feed"

// Treść zmienia się tylko przy deployu — generuj raz, w czasie builda
export const dynamic = "force-static"

export async function GET() {
  return new Response(buildFeed("pl"), { headers: FEED_HEADERS })
}
