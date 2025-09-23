// src/components/Blog.tsx

import Image from "next/image"
import Link from "next/link"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Zaktualizowana struktura danych: tagi to obiekty z nazwą i slugiem do URL
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
      { name: "Web Dev", slug: "web-dev" },
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
      { name: "shadcn", slug: "shadcn" },
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
      { name: "Narzędzia", slug: "narzedzia" },
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
      { name: "Narzędzia", slug: "narzedzia" },
    ],
    date: "12 Sierpnia, 2025",
    readTime: 9,
  },
]

export function BlogB() {
  return (
    <section className="flex flex-col justify-center p-4 py-6 md:py-8 lg:py-12 xl:py-16 xl:min-h-[calc(100vh-4rem)] container mx-auto">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3 lg:sticky top-22 self-start ">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-medium">
              Blog
            </h2>
            <p className="text-muted-foreground lg:text-lg 2xl:text-xl mt-6 max-w-xs">
              Zobacz nad czym obecnie pracuję
            </p>
          </div>
        </div>
        <div className="lg:col-span-9">
          <div className="grid gap-4 leading-relaxed md:grid-cols-2 mt-4">
            {blogPostsData.map((post) => (
              <Card
                key={post.id}
                className="flex flex-col h-full bg-transparent border-primary/20 overflow-hidden transition-all duration-300 hover:border-primary/50"
              >
                {/* --- SEKCJA OBRAZKA --- */}
                <Link
                  href={post.href}
                  aria-label={`Przejdź do wpisu: ${post.title}`}
                >
                  <div className="relative aspect-video overflow-hidden -mt-6">
                    <Image
                      src={post.imageSrc}
                      alt={post.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </Link>

                {/* --- SEKCJA TREŚCI --- */}
                <div className="flex h flex-col flex-grow px-4">
                  <CardHeader className="p-0">
                    <Link href={post.href}>
                      <CardTitle className="text-lg mb-2 hover:text-primary transition-colors duration-300 hover:underline">
                        {post.title}
                      </CardTitle>
                    </Link>
                    <CardDescription className="line-clamp-3">
                      {post.description}
                    </CardDescription>
                  </CardHeader>

                  {/* Stopka z tagami i metadanymi */}
                  <CardFooter className="p-0 mt-auto flex flex-col items-start gap-4">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link key={tag.slug} href={`/blog/tag/${tag.slug}`}>
                          <Badge
                            variant="outline"
                            className="font-normal transition-colors duration-300 hover:border-primary"
                          >
                            {tag.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {post.date} &middot; {post.readTime} min czytania
                    </p>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
