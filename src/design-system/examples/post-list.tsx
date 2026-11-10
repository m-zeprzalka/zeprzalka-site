import { PostList } from "@/components/sections/post-list"
import { getHomeContent } from "@/lib/content/home"

/** Pięć wpisów, trzy widoczne — „Pokaż wszystkie” odsłania resztę w miejscu. */
export function PostListExample() {
  const { blog } = getHomeContent("pl")

  return (
    <div className="w-full">
      <PostList posts={blog.posts.slice(0, 5)} visible={3} all={blog.all} labels={blog.labels} />
    </div>
  )
}
