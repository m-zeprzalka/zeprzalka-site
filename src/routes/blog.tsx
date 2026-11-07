/**
 * Trasy bloga serwisu z parametrem — fabryki z `blog-routes.tsx` z widokami serwisu.
 * Każdy plik `page.tsx` w `src/app/(pl)` i `src/app/en` re-eksportuje gotowe funkcje.
 */
import { BlogIndexView } from "@/components/views/BlogIndexView"
import { PostView } from "@/components/views/PostView"
import { TaxonomyView } from "@/components/views/TaxonomyView"
import { blogRoutes } from "./blog-routes"

export const { postRoute, taxonomyRoute, blogArchiveRoute } = blogRoutes({
  Post: PostView,
  Taxonomy: TaxonomyView,
  Index: BlogIndexView,
})
