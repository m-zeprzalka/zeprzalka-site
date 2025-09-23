// [project]/src/components/alternative/BlogB.tsx

import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Dane bloga
const blogPostsData = [
  {
    id: "strategie-nextjs-2025",
    title: "Nowoczesne strategie renderowania w Next.js 15",
    description:
      "Odkryj, jak Server Actions i nowe techniki cachowania zmieniają sposób, w jaki budujemy aplikacje internetowe.",
    imageSrc: "/min.png",
    imageAlt: "Diagram architektoniczny Next.js",
    href: "/blog/strategie-nextjs-2025",
    tags: [
      { name: "Next.js", slug: "next-js" },
      { name: "React", slug: "react" },
    ],
    date: "14 Września, 2025",
    readTime: 7,
  },
  {
    id: "design-system-shadcn",
    title: "Hiperminimalizm z shadcn/ui: Mniej znaczy więcej",
    description:
      "Analiza, dlaczego podejście 'copy-paste' shadcn/ui jest rewolucyjne dla tworzenia spójnych i estetycznych interfejsów.",
    imageSrc: "/min.png",
    imageAlt: "Komponenty shadcn/ui w edytorze kodu",
    href: "/blog/design-system-shadcn",
    tags: [
      { name: "Design", slug: "design" },
      { name: "UI/UX", slug: "ui-ux" },
    ],
    date: "28 Sierpnia, 2025",
    readTime: 5,
  },
  {
    id: "potega-ai-w-kodzie",
    title: "Praktyczne zastosowania AI w codziennym developmentie",
    description:
      "Jak narzędzia AI, takie jak Copilot i v0.dev, mogą przyspieszyć Twoją pracę i podnieść jakość kodu.",
    imageSrc: "/min.png",
    imageAlt: "Ilustracja przedstawiająca sztuczną inteligencję i kod",
    href: "/blog/potega-ai-w-kodzie",
    tags: [
      { name: "AI", slug: "ai" },
      { name: "Development", slug: "development" },
    ],
    date: "12 Sierpnia, 2025",
    readTime: 9,
  },
  {
    id: "potega-ai2-w-kodzie",
    title: "Praktyczne zastosowania AI w codziennym developmentie",
    description:
      "Jak narzędzia AI, takie jak Copilot i v0.dev, mogą przyspieszyć Twoją pracę i podnieść jakość kodu.",
    imageSrc: "/min.png",
    imageAlt: "Ilustracja przedstawiająca sztuczną inteligencję i kod",
    href: "/blog/potega-ai-w-kodzie2",
    tags: [
      { name: "AI", slug: "ai" },
      { name: "Development", slug: "development" },
    ],
    date: "12 Sierpnia, 2025",
    readTime: 9,
  },
]

export function BlogC() {
  return (
    <section className="container mx-auto flex flex-col justify-center p-4 py-12 md:py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-3 lg:sticky top-24 self-start">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Blog</h2>
            <p className="mt-4 max-w-xs text-lg text-muted-foreground">
              Myśli, analizy i projekty ze świata nowoczesnego developmentu.
            </p>
          </div>
        </aside>

        <main className="lg:col-span-9">
          <div className="grid gap-8 leading-relaxed md:grid-cols-2">
            {blogPostsData.map((post) => (
              // --- POCZĄTEK KODU NOWEJ KARTY ---
              <Link key={post.id} href={post.href} className="group block">
                <Card className="relative h-[450px] overflow-hidden rounded-xl border-2 border-transparent transition-all duration-500 ease-in-out hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20">
                  {/* Tło z obrazkiem i efektem zoomu */}
                  <Image
                    src={post.imageSrc}
                    alt={post.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Gradient dla czytelności tekstu */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                  {/* Kontener na treść */}
                  <div className="relative flex h-full flex-col justify-end p-6 text-white">
                    <div className="flex-grow"></div>{" "}
                    {/* Pusty div do wypchnięcia treści na dół */}
                    {/* Tagi z efektem "Glassmorphism" */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag.slug}
                          className="border-white/20 bg-white/10 py-1 px-3 text-sm font-normal text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white/20"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    {/* Tytuł */}
                    <h3 className="text-2xl font-bold leading-tight tracking-tight transition-colors duration-300">
                      {post.title}
                    </h3>
                    {/* Metadane */}
                    <div className="mt-4 flex items-center text-sm text-white/70">
                      <span>{post.date}</span>
                      <span className="mx-2">&middot;</span>
                      <span>{post.readTime} min czytania</span>
                    </div>
                  </div>
                </Card>
              </Link>
              // --- KONIEC KODU NOWEJ KARTY ---
            ))}
          </div>
        </main>
      </div>
    </section>
  )
}
