/**
 * Trasy bloga z parametrem — fabryki z `blog-routes.tsx` z widokami serwisu.
 * Każdy plik `page.tsx` w `src/app/(pl)` i `src/app/en` re-eksportuje gotowe funkcje.
 */
import { BlogPage } from "@/components/views/blog-page"
import { PostPage } from "@/components/views/post-page"
import { TaxonomyPage } from "@/components/views/taxonomy-page"
import { blogRoutes } from "./blog-routes"

export const { postRoute, taxonomyRoute, blogArchiveRoute } = blogRoutes({
  Post: PostPage,
  Taxonomy: TaxonomyPage,
  Index: BlogPage,
})
