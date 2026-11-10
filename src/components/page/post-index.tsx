import { PostRow } from "@/components/sections/post-list"
import type { Post } from "@/lib/types"

/**
 * Wpisy jako indeks — ten sam wiersz co na starcie (rok raz na rok, tytuł,
 * data, okładka na marginesie przy najechaniu). Wymaga `PeekProvider` z kartami
 * `post-<slug>` (`postPeeks`).
 */
export function PostIndex({ posts, newLabel }: { posts: readonly Post[]; newLabel: string }) {
  return (
    <ol className="mt-6 grid">
      {posts.map((post, index) => (
        <PostRow
          key={post.slug}
          post={post}
          showYear={index === 0 || posts[index - 1]?.year !== post.year}
          newLabel={newLabel}
        />
      ))}
    </ol>
  )
}
