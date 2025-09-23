// app/blog/[slug]/page.tsx
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Copy,
  Hash,
  Info,
  Link as LinkIcon,
  Linkedin,
  List,
  Twitter,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// --- 1. Komponenty pomocnicze (dla czystości kodu) ---

// Ulepszony komponent bloku informacyjnego (Callout)
interface CalloutProps {
  icon?: React.ReactNode
  children: React.ReactNode
}

function Callout({
  children,
  icon = <Info className="w-5 h-5" />,
}: CalloutProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4 my-8">
      <div className="text-primary mt-1">{icon}</div>
      <div className="text-foreground/90 prose-p:my-0">{children}</div>
    </div>
  )
}

// Ulepszony wrapper dla bloków kodu z przyciskiem kopiowania
function CodeBlockWrapper({ children }: { children: React.ReactNode }) {
  const [hasCopied, setHasCopied] = useState(false)

  const copyToClipboard = () => {
    // Zakładamy, że `children` zawiera element `code` z tekstem
    const codeElement = (children as any)?.props?.children?.props?.children
    if (typeof codeElement === "string") {
      navigator.clipboard.writeText(codeElement)
      setHasCopied(true)
      setTimeout(() => setHasCopied(false), 2000)
    }
  }

  return (
    <div className="relative group my-8">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={copyToClipboard}
        aria-label="Skopiuj kod"
      >
        {hasCopied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
      <pre className="bg-muted/50 p-4 rounded-lg border text-sm overflow-x-auto">
        {children}
      </pre>
    </div>
  )
}

// Ulepszony dynamiczny Spis Treści
function TableOfContents({
  headings,
}: {
  headings: { id: string; level: number; text: string }[]
}) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0% 0% -80% 0%" } // Aktywuje, gdy nagłówek jest w górnych 20% ekranu
    )

    headings.forEach((h) => {
      const element = document.getElementById(h.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      headings.forEach((h) => {
        const element = document.getElementById(h.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [headings])

  return (
    <div className="lg:sticky top-24">
      <h3 className="font-medium text-foreground mb-3">Spis treści</h3>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <Link
              href={`#${heading.id}`}
              className={`block transition-colors ${
                heading.level === 3 ? "pl-4" : ""
              } ${
                activeId === heading.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// --- 2. GŁÓWNY KOMPONENT STRONY ---
export default function UltimateSinglePostPage() {
  // Dane powinny pochodzić z CMS lub pliku MDX
  const postData = {
    title: "Cryptonique - Aplikacja do predykcji cen kryptowalut",
    description:
      "Jak budować inteligentne i skalowalne aplikacje, wykorzystując potęgę Next.js i modeli językowych AI.",
    categories: [
      { name: "Strategia", slug: "strategia" },
      { name: "Produkt", slug: "produkt" },
    ],
    date: "2025-09-15",
    readingTime: 8,
    image: "/min.png",
    author: {
      name: "zeprzalka.com",
      title: "Digital Solutions Architect",
      bio: "Tworzę rozwiązania łączące biznes z technologią.",
      avatar: "", // Pusta ścieżka do avatara, aby pokazać Fallback
    },
    headings: [
      { id: "fundamenty", level: 2, text: "Fundamenty: Dlaczego Next.js?" },
      { id: "strategia", level: 2, text: "Integracja: Strategia i Praktyka" },
      {
        id: "podsumowanie",
        level: 2,
        text: "Podsumowanie: Architekt Przyszłości",
      },
    ],
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Skopiowano! ✨", {
      description: "Link do artykułu znajduje się w Twoim schowku.",
    })
  }

  return (
    <>
      <main className="container mx-auto p-4 py-6 md:py-8 lg:py-12 xl:py-16">
        {/* --- UKŁAD GŁÓWNY: TREŚĆ + BOCZNY SPIS TREŚCI --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-x-12">
          {/* Lewa kolumna - pusta na małych, spis treści na dużych */}
          <aside className="hidden lg:block lg:col-span-1">
            <TableOfContents headings={postData.headings} />
          </aside>

          {/* Środkowa kolumna z treścią */}
          <article className="lg:col-span-3">
            {/* --- NAGŁÓWEK ARTYKUŁU --- */}
            <header className="mb-12">
              {/* --- BREADCRUMBS --- */}
              <Breadcrumb className="mb-6">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" aria-current="page">
                      {postData.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="flex flex-wrap gap-2 mb-4">
                {postData.categories.map((cat) => (
                  <Badge
                    key={cat.slug}
                    variant="outline"
                    className="text-sm"
                    asChild
                  >
                    <Link href={`/blog/kategoria/${cat.slug}`}>{cat.name}</Link>
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tighter mb-4 leading-tight">
                {postData.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {postData.description}
              </p>
              <div className="flex items-center gap-x-4 gap-y-2 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <time dateTime={postData.date}>15 Września 2025</time>
                </div>
                <span className="text-muted-foreground/50">/</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{postData.readingTime} min czytania</span>
                </div>
              </div>
            </header>

            <figure className="relative w-full aspect-[16/9] rounded-xl border overflow-hidden mb-12 shadow-md">
              <Image
                src={postData.image}
                alt="Abstrakcyjna wizualizacja połączeń neuronowych i kodu"
                fill
                className="object-cover"
                priority
              />
            </figure>

            {/* --- TREŚĆ ARTYKUŁU Z ULEPSZONĄ TYPOGRAFIĄ --- */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none
    prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
    prose-h2:text-2xl prose-h3:text-xl
    prose-p:text-base prose-p:text-foreground prose-p:leading-relaxed
    prose-strong:text-foreground
    prose-blockquote:border-primary prose-blockquote:bg-muted/40 prose-blockquote:rounded-lg prose-blockquote:font-medium
    prose-a:text-primary prose-a:underline prose-a:underline-offset-2 prose-a:transition-colors
    prose-img:rounded-lg prose-img:shadow-md
    prose-pre:bg-muted/50 prose-pre:rounded-lg prose-pre:p-4 prose-code:text-[15px]
    prose-table:border prose-table:rounded-lg prose-th:bg-muted/50 prose-th:font-semibold prose-td:p-2 prose-th:p-2
  "
            >
              <p>
                W dzisiejszym cyfrowym krajobrazie, gdzie innowacja jest walutą,
                połączenie nowoczesnego developmentu z inteligencją maszynową
                przestaje być opcją, a staje się koniecznością. Jako architekci
                rozwiązań cyfrowych, stoimy przed wyzwaniem tworzenia aplikacji,
                które są nie tylko szybkie, ale także inteligentne i proaktywne.
              </p>

              {/* Spis treści dla urządzeń mobilnych */}
              <div className="border rounded-lg px-4 lg:hidden">
                <h3 className="font-medium text-foreground mb-3 mt-4">
                  Spis treści
                </h3>
                <ul className="space-y-2 text-base">
                  {postData.headings.map((h) => (
                    <li key={h.id}>
                      <Link
                        href={`#${h.id}`}
                        className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                      >
                        {h.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <h2 id={postData.headings[0].id}>{postData.headings[0].text}</h2>
              <p>
                Framework ten dostarcza nam solidnych fundamentów. Jego kluczowe
                zalety w kontekście integracji z AI to:
              </p>

              <ol className="list-decimal list-inside space-y-3 pl-4 text-base text-muted-foreground bg-muted/30 border-l-4 border-primary/20 rounded-lg py-4 px-4 my-6">
                <li>
                  <strong className="text-foreground">
                    Server-Side Rendering (SSR) i SSG:
                  </strong>{" "}
                  Kluczowe dla SEO i wydajności.
                </li>
                <li>
                  <strong className="text-foreground">
                    Route Handlers (API Routes):
                  </strong>{" "}
                  Upraszczają bezpieczną komunikację z modelami AI.
                </li>
                <li>
                  <strong className="text-foreground">
                    React Server Components (RSC):
                  </strong>{" "}
                  Idealne dla asynchronicznych zapytań do AI.
                </li>
              </ol>

              <blockquote className="border-l-4 border-primary pl-5 italic text-lg text-muted-foreground bg-muted/40 py-4 px-6 my-8 rounded-lg font-medium shadow-sm">
                „Celem nie jest dodanie AI jako funkcji. Celem jest
                wykorzystanie AI do fundamentalnego ulepszenia doświadczenia
                użytkownika.”
              </blockquote>

              <hr className="my-16" />

              <h2 id={postData.headings[1].id}>{postData.headings[1].text}</h2>
              <p>
                Integracja z AI to przemyślana architektura. Polega na łączeniu
                narzędzi takich jak <a href="#">Vercel AI SDK</a> z jasnym celem
                biznesowym.
              </p>

              <Callout>
                <p>
                  <strong>Pro Tip:</strong> Zawsze przechowuj klucze API w
                  zmiennych środowiskowych (`.env.local`) i nigdy nie
                  udostępniaj ich po stronie klienta. Używaj API Routes w
                  Next.js jako pośrednika.
                </p>
              </Callout>

              <CodeBlockWrapper>
                <code className="language-typescript font-mono">
                  {`// app/api/chat/route.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Bezpieczne użycie
});

// ... reszta logiki`}
                </code>
              </CodeBlockWrapper>

              <h2 id={postData.headings[2].id}>{postData.headings[2].text}</h2>
              <p>
                Rola dewelopera ewoluuje. Nie jesteśmy już tylko wykonawcami,
                ale strategami, którzy łączą kropki między biznesem, technologią
                a rosnącymi możliwościami sztucznej inteligencji.
              </p>
            </div>
            {/* --- TL;DR --- */}
            <div className="bg-muted/50 border rounded-lg p-6 space-y-3 not-prose mt-4">
              <h3 className="flex items-center gap-2 font-medium text-foreground text-xl">
                <List className="w-5 h-5" />W pigułce (TL;DR)
              </h3>
              <ul className="list-disc pl-5 text-base space-y-2">
                <li>
                  Next.js dostarcza idealnych narzędzi (SSR, API Routes, RSC) do
                  integracji z modelami AI.
                </li>
                <li>
                  Kluczem do sukcesu jest solidna architektura, a nie tylko
                  wywołania API.
                </li>
                <li>
                  Rola dewelopera ewoluuje w kierunku stratega łączącego biznes,
                  design i technologię AI.
                </li>
              </ul>
            </div>
            {/* --- STOPKA ARTYKUŁU --- */}
            <footer className="mt-16 pt-10 border-t space-y-12">
              {/* Tagi i Udostępnianie */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Hash className="w-5 h-5 text-muted-foreground" />
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">AI</Badge>
                  <Badge variant="secondary">Architektura</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Udostępnij:</span>
                  <Button variant="outline" size="icon" asChild>
                    <Link href="#" aria-label="Udostępnij na Twitterze">
                      <Twitter className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href="#" aria-label="Udostępnij na LinkedIn">
                      <Linkedin className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" onClick={copyLink}>
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Autor */}
              <div className="flex flex-col sm:flex-row items-start gap-6 bg-muted/40 p-6 rounded-lg border">
                <Avatar className="w-20 h-20 border">
                  <AvatarImage
                    src={postData.author.avatar}
                    alt={postData.author.name}
                  />
                  <AvatarFallback>ZP</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <span className="text-sm text-muted-foreground">
                    Napisane przez
                  </span>
                  <h4 className="font-semibold text-xl mt-1">
                    {postData.author.name}
                  </h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    {postData.author.title}
                  </p>
                  <p className="mt-2 text-foreground/80 text-base">
                    {postData.author.bio}
                  </p>
                </div>
              </div>

              {/* Nawigacja - Następny/Poprzedni Post */}
              <nav className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="#"
                  className="border rounded-lg p-5 hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Poprzedni artykuł</span>
                  </div>
                  <span className="font-medium text-lg text-foreground">
                    5 Zasad Dobrego Design Systemu
                  </span>
                </Link>
                <Link
                  href="#"
                  className="border rounded-lg p-5 hover:border-primary/50 transition-colors text-right group"
                >
                  <div className="flex items-center justify-end gap-3 text-sm text-muted-foreground mb-2">
                    <span>Następny artykuł</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                  <span className="font-medium text-lg text-foreground">
                    Praktyczne Zastosowania Vercel AI SDK
                  </span>
                </Link>
              </nav>
            </footer>
          </article>
        </div>
      </main>
    </>
  )
}
