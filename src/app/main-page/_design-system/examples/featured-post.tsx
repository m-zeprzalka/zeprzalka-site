import { FeaturedPost } from "@/app/main-page/_components/page/featured-post"
import { postDate } from "@/app/main-page/_lib/content/pages"
import { getSource } from "@/app/main-page/_lib/content/source"

/** Dwa najnowsze wpisy — na pierwszej stronie bloga, nad indeksem. */
export function FeaturedPostExample() {
  const { posts } = getSource("pl")

  return (
    <div className="grid w-full gap-8 sm:grid-cols-2 sm:gap-6">
      {posts.slice(0, 2).map(({ card, description }) => (
        <FeaturedPost
          key={card.slug}
          post={card}
          description={description}
          date={postDate("pl", card.iso)}
        />
      ))}
    </div>
  )
}
