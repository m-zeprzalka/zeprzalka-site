import { blogArchiveRoute } from "@/routes/blog"

const route = blogArchiveRoute("en", "page")

/** Wszystkie adresy powstają przy buildzie — nieznany to od razu 404. */
export const dynamicParams = false
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
