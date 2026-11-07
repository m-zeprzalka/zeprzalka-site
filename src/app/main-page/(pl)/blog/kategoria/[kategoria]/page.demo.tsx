import { taxonomyRoute } from "@/app/main-page/_routes/blog"

const route = taxonomyRoute("pl", "categories", "kategoria")

/** Wszystkie adresy powstają przy buildzie — nieznany to od razu 404. */
export const dynamicParams = false
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
