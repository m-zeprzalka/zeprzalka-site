import { PostList } from "@/app/main-page/_components/sections/post-list"
import { getHomeContent } from "@/app/main-page/_lib/content/home"

/** Pięć wpisów, trzy widoczne — „Pokaż wszystkie” odsłania resztę w miejscu. */
export function PostListExample() {
  const { blog } = getHomeContent("pl")

  return (
    <div className="w-full">
      <PostList posts={blog.posts.slice(0, 5)} visible={3} all={blog.all} labels={blog.labels} />
    </div>
  )
}
