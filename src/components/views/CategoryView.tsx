import { PageHeader } from "@/components/PageHeader"
import { PostListView } from "@/components/views/PostListView"
import type { Post } from "@/lib/posts"
import type { Locale } from "@/i18n/config"
import { fill } from "@/i18n/content/common"
import { countArticles, getPages } from "@/i18n/content/pages"

export function CategoryView({
  locale,
  label,
  posts,
}: {
  locale: Locale
  label: string
  posts: Post[]
}) {
  const copy = getPages(locale).blog

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <PageHeader
        badge={copy.categoryBadge}
        title={label}
        description={fill(copy.inCategory, {
          count: countArticles(posts.length, locale),
        })}
      />

      <PostListView posts={posts} locale={locale} />
    </div>
  )
}
