"use client"

import { useInView } from "react-intersection-observer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const galleryItems = [
  {
    id: 1,
    title: "Orlen Mistrzowie Podwórek",
    category: "UX/UI Design",
    type: "video",
    src: "https://socontent.marketing/img/orlen-min.mp4",
  },
  {
    id: 2,
    title: "Vinci Facilities",
    category: "Design & Deployment",
    type: "video",
    src: "https://socontent.marketing/img/vinci-facilities.mp4",
  },
  {
    id: 3,
    title: "Spartanie Dzieciom",
    category: "Design & Deployment",
    type: "video",
    src: "https://socontent.marketing/img/spartanie-dzieciom.mp4",
  },
  {
    id: 4,
    title: "Orlen Paczka",
    category: "UX/UI Design",
    type: "video",
    src: "https://socontent.marketing/img/orlen-paczka.mp4",
  },
  {
    id: 5,
    title: "Inteligentna Polska",
    category: "Design & Deployment",
    type: "video",
    src: "https://socontent.marketing/img/ip.mp4",
  },
  {
    id: 6,
    title: "Innowator Mazowsza",
    category: "Design & Deployment",
    type: "video",
    src: "https://socontent.marketing/img/innowator-mazowsza.mp4",
  },
  {
    id: 7,
    title: "Klinika Berbecki",
    category: "Design & Deployment",
    type: "video",
    src: "https://socontent.marketing/img/berbecki-min.mp4",
  },
  {
    id: 8,
    title: "Onelook",
    category: "Design & Deployment",
    type: "video",
    src: "https://socontent.marketing/img/onelook-min.mp4",
  },
]

function LazyVideo({ src, title, category }: { src: string; title: string; category: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "600px" })

  return (
    <div ref={ref} className="relative -my-6">
      {!inView && <div className="aspect-video w-full bg-muted/30" />}
      {inView && (
        <video
          className="w-full h-auto block animate-in fade-in duration-700"
          autoPlay loop muted playsInline
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Category Badge */}
      <div className="absolute top-3 left-3 pointer-events-none">
        <Badge
          variant="secondary"
          className="px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {category}
        </Badge>
      </div>

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <h3 className="text-white font-medium text-lg">{title}</h3>
      </div>
    </div>
  )
}

export function GalleryB() {
  return (
    <section className="flex flex-col justify-center p-4 py-6 md:py-8 lg:py-12 xl:py-16 xl:min-h-[calc(100vh-4rem)] container mx-auto">
      <div className="grid gap-6 lg:gap-8 xl:gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3 lg:sticky top-22 self-start">
          <div>
            <h2 className="text-3xl md:text-4xl md:font-semi-bold font-medium">
              Portfolio
            </h2>
            <p className="text-muted-foreground lg:text-lg 2xl:text-xl mt-2 lg:mt-6 max-w-xs">
              Wszechstronne kompleksowe i innowacyjne realizacje
            </p>
          </div>
        </div>
        <div className="lg:col-span-9">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 mt-4">
            {galleryItems.map((item) => (
              <Card
                key={item.id}
                className="break-inside-avoid mb-4 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl"
              >
                <LazyVideo src={item.src} title={item.title} category={item.category} />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
