import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeSection } from "@/components/home/HomeSection"
import { PostGrid } from "@/components/blog/PostCard"
import { getAllPosts } from "@/lib/posts"
import { ROUTES, type Locale } from "@/i18n/config"
import { getHome } from "@/i18n/content/home"

export function BlogPreview({ locale }: { locale: Locale }) {
  const posts = getAllPosts(locale).slice(0, 6)
  const copy = getHome(locale).blog

  return (
    <HomeSection
      title={copy.title}
      lead={copy.lead}
      sectionClassName="container mx-auto flex flex-col justify-center p-4 py-12 md:py-16 lg:py-24"
      gridClassName="gap-12"
      stickyClassName="top-24"
      action={
        <Button asChild variant="outline" size="sm" className="mt-6">
          <Link href={ROUTES.blog[locale]}>{copy.cta}</Link>
        </Button>
      }
    >
      <PostGrid
        posts={posts}
        locale={locale}
        headingLevel="h3"
        className="grid gap-8 sm:grid-cols-2"
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
      />
    </HomeSection>
  )
}
