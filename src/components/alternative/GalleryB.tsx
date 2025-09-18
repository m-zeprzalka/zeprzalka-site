"use client"

import { useState } from "react"
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

export function GalleryB() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  return (
    <section className="flex flex-col justify-center p-4 py-6 md:py-8 lg:py-12 xl:py-16 lg:min-h-[calc(100vh-4rem)] container mx-auto">
      <div className="grid gap-6 lg:gap-8 xl:gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3 lg:sticky top-22 self-start ">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-medium">
              Portfolio
            </h2>
            <p className="text-muted-foreground lg:text-lg 2xl:text-xl mt-6 max-w-xs">
              Wszechstronne kompleksowe i innowacyjne realizacje
            </p>
          </div>
        </div>
        <div className="lg:col-span-9">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 mt-4">
            {galleryItems.map((item) => {
              const isHovered = hoveredId === item.id

              return (
                <Card
                  key={item.id}
                  className="break-inside-avoid mb-4 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Media Container */}
                  <div className="relative -my-6">
                    {/* Media Content */}
                    {item.type === "video" ? (
                      <video
                        className="w-full h-auto block"
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src={item.src} type="video/mp4" />
                      </video>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-auto block"
                        loading="lazy"
                      />
                    )}

                    {/* Overlays */}
                    {/* Dark gradient overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 pointer-events-none"
                      style={{ opacity: isHovered ? 1 : 0 }}
                    />

                    {/* Category Badge - pokazuje się na hover */}
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <Badge
                        variant="secondary"
                        className="px-3 py-1"
                        style={{ opacity: isHovered ? 1 : 0 }}
                      >
                        {item.category}
                      </Badge>
                    </div>

                    {/* Title and arrow - pokazuje się na hover */}
                    <div
                      className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 pointer-events-none"
                      style={{
                        transform: isHovered
                          ? "translateY(0)"
                          : "translateY(8px)",
                        opacity: isHovered ? 1 : 0,
                      }}
                    >
                      <div className="flex items-end gap-2">
                        <h3 className="text-white font-medium text-lg">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
