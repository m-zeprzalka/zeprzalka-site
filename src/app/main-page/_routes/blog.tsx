/**
 * Trasy bloga podglądu z parametrem — te same fabryki co w serwisie
 * (`src/routes/blog-routes.tsx`), z widokami nowej wersji i metadanymi `noindex`.
 */
import { BlogPage } from "@/app/main-page/_components/views/blog-page"
import { PostPage } from "@/app/main-page/_components/views/post-page"
import { TaxonomyPage } from "@/app/main-page/_components/views/taxonomy-page"
import { preview } from "@/app/main-page/_lib/metadata"
import { blogRoutes } from "@/routes/blog-routes"

export const { postRoute, taxonomyRoute, blogArchiveRoute } = blogRoutes(
  { Post: PostPage, Taxonomy: TaxonomyPage, Index: BlogPage },
  preview
)
