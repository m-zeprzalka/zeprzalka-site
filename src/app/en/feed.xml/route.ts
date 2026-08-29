import { FEED_HEADERS, buildFeed } from "@/lib/feed"

export const dynamic = "force-static"

export async function GET() {
  return new Response(buildFeed("en"), { headers: FEED_HEADERS })
}
