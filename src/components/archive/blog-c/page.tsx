// app/blog/[slug]/page.tsx
"use client"

// --- IMPORTY ---
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
import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"

// --- 1. KOMPONENTY POMOCNICZE (zintegrowane w jednym pliku) ---
// Adnotacja: W większym projekcie każdy z tych komponentów mógłby trafić do osobnego pliku,
// np. w folderze /components/blog, dla lepszej organizacji i reużywalności.

/**
 * Pasek postępu czytania, który reaguje na scrollowanie strony.
 */
function ReadingProgressBar() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const scrollHeight = () => {
      const el = document.documentElement
      const scrollTop = el.scrollTop || document.body.scrollTop
      const scrollHeight = el.scrollHeight || document.body.scrollHeight
      const progress = (scrollTop / (scrollHeight - el.clientHeight)) * 100
      setWidth(progress)
    }

    window.addEventListener("scroll", scrollHeight)
    return () => window.removeEventListener("scroll", scrollHeight)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-primary/10 z-50">
      <div
        className="h-1 bg-primary transition-all duration-75"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

/**
 * Komponent do wyświetlania bloków informacyjnych (Callout).
 */
interface CalloutProps {
  icon?: React.ReactNode
  children: React.ReactNode
}
function Callout({
  children,
  icon = <Info className="w-5 h-5" />,
}: CalloutProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4 my-8 not-prose">
      <div className="text-primary mt-1 flex-shrink-0">{icon}</div>
      <div className="text-foreground/90 prose-p:my-0">{children}</div>
    </div>
  )
}

/**
 * Wrapper dla bloków kodu z przyciskiem kopiowania i obsługą syntax highlighting.
 * Adnotacja: Dla pełnego podświetlania składni, projekt wymagałby biblioteki jak 'shiki' lub 'rehype-pretty-code'
 * skonfigurowanej na poziomie builda. Poniżej uproszczona wersja wizualna.
 */
function CodeBlockWrapper({ children }: { children: React.ReactNode }) {
  const [hasCopied, setHasCopied] = useState(false)
  const textInput = useRef<HTMLDivElement>(null)

  const copyToClipboard = () => {
    const code = textInput.current?.textContent
    if (code) {
      navigator.clipboard.writeText(code)
      setHasCopied(true)
      toast.success("Skopiowano do schowka!")
      setTimeout(() => setHasCopied(false), 2000)
    }
  }

  return (
    <div className="relative group my-8">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={copyToClipboard}
        aria-label="Skopiuj kod"
      >
        {hasCopied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
      {/* Adnotacja: Klasa 'prose-pre:bg-transparent' w głównym divie treści jest potrzebna,
          aby ten niestandardowy styl tła zadziałał poprawnie. */}
      <pre className="bg-muted/50 p-4 rounded-lg border text-sm overflow-x-auto">
        <div ref={textInput}>{children}</div>
      </pre>
    </div>
  )
}

/**
 * Dynamiczny Spis Treści, który podświetla aktualnie widoczną sekcję.
 */
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
      if (element) observer.observe(element)
    })

    return () => {
      headings.forEach((h) => {
        const element = document.getElementById(h.id)
        if (element) observer.unobserve(element)
      })
    }
  }, [headings])

  return (
    <div className="lg:sticky top-24">
      <h3 className="font-semibold text-foreground mb-3 text-lg">
        Spis treści
      </h3>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <Link
              href={`#${heading.id}`}
              className={`block transition-colors ${
                heading.level === 3 ? "pl-4 border-l-2" : "border-l-2"
              } ${
                activeId === heading.id
                  ? "text-primary font-medium border-primary"
                  : "text-muted-foreground hover:text-primary border-transparent hover:border-muted-foreground/50"
              } py-1`}
            >
              <span className="pl-2">{heading.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// --- 2. GŁÓWNY KOMPONENT STRONY ---
export default function UltimateSinglePostPage() {
  // Adnotacja: Dane posta są tutaj na sztywno. W prawdziwej aplikacji, komponent ten
  // powinien je otrzymywać jako `props` od nadrzędnego komponentu serwerowego,
  // który pobrałby je z CMS lub pliku MDX.
  const postData = {
    slug: "architektura-nowoczesnych-aplikacji-nextjs-ai",
    title: "Architektura Nowoczesnych Aplikacji: Łączenie Next.js z AI",
    description:
      "Jak budować inteligentne i skalowalne aplikacje, wykorzystując potęgę Next.js i modeli językowych AI.",
    category: "Strategia i Produkt",
    date: "2025-09-15",
    readingTime: 12,
    image: "/min.png", // Upewnij się, że ten obrazek istnieje w folderze /public
    author: {
      name: "zeprzalka.com",
      title: "Digital Solutions Architect",
      bio: "Tworzę innowacyjne rozwiązania cyfrowe, które łączą świat biznesu z najnowszymi technologiami.",
      avatar: "",
    },
    headings: [
      { id: "fundamenty", level: 2, text: "Fundamenty: Dlaczego Next.js?" },
      { id: "kluczowe-zalety", level: 3, text: "Kluczowe zalety frameworka" },
      { id: "strategia", level: 2, text: "Integracja: Strategia i Praktyka" },
      { id: "pro-tip", level: 3, text: "Pro Tip: Bezpieczeństwo kluczy API" },
      {
        id: "podsumowanie",
        level: 2,
        text: "Podsumowanie: Architekt Przyszłości",
      },
    ],
  }

  // Adnotacja: Funkcje interaktywne, jak kopiowanie linku, wymagają, aby ten komponent
  // był komponentem klienckim (`"use client"` na górze pliku).
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Skopiowano! ✨", {
      description: "Link do artykułu znajduje się w Twoim schowku.",
    })
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareTitle = postData.title

  return (
    <>
      <ReadingProgressBar />
      <main className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-8 lg:gap-x-12 xl:gap-x-16">
          <aside className="hidden lg:block lg:col-span-2">
            <TableOfContents headings={postData.headings} />
          </aside>

          <article className="lg:col-span-6">
            <header className="mb-12">
              <Breadcrumb className="mb-6">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <span
                      className="text-foreground font-medium"
                      aria-current="page"
                    >
                      {postData.title}
                    </span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <Link href="#" className="no-underline">
                <Badge
                  variant="outline"
                  className="mb-4 text-sm hover:bg-muted transition-colors"
                >
                  {postData.category}
                </Badge>
              </Link>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 leading-tight">
                {postData.title}
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                {postData.description}
              </p>

              <div className="flex items-center gap-x-4 gap-y-2 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <time dateTime={postData.date}>
                    {new Date(postData.date).toLocaleDateString("pl-PL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <span className="text-muted-foreground/50 hidden sm:inline">
                  ·
                </span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{postData.readingTime} min czytania</span>
                </div>
              </div>
            </header>

            <figure className="relative w-full aspect-[16/9] rounded-xl border overflow-hidden mb-12 shadow-lg">
              <Image
                src={postData.image}
                alt={`Ilustracja do artykułu: ${postData.title}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1000px"
              />
            </figure>

            <div
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:scroll-m-24 prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-14 prose-h2:border-b prose-h2:pb-3
                prose-h3:text-2xl prose-h3:mb-5 prose-h3:mt-10
                prose-p:leading-relaxed 
                prose-strong:text-foreground
                prose-blockquote:border-primary prose-blockquote:text-base prose-blockquote:font-normal
                prose-a:text-primary hover:prose-a:text-primary/80 prose-a:underline-offset-4
                prose-img:rounded-lg prose-img:shadow-md
                prose-li:my-1
                prose-table:w-full prose-table:my-8
                prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:border-b-2
                prose-td:p-3 prose-td:border-b
                prose-pre:bg-transparent prose-pre:p-0 prose-pre:my-0 prose-code:text-[15px]
              "
            >
              <p>
                W dzisiejszym cyfrowym krajobrazie, gdzie innowacja jest walutą,
                połączenie nowoczesnego developmentu z inteligencją maszynową
                przestaje być opcją, a staje się koniecznością. Jako architekci
                rozwiązań cyfrowych, stoimy przed wyzwaniem tworzenia aplikacji,
                które są nie tylko szybkie, ale także inteligentne i proaktywne.
              </p>

              <div className="bg-muted/50 border rounded-lg p-6 my-8 space-y-3 not-prose">
                <h3 className="flex items-center gap-2 font-medium text-foreground text-xl mt-0">
                  <List className="w-5 h-5" />W pigułce (TL;DR)
                </h3>
                <ul className="list-disc pl-5 text-base space-y-2 text-muted-foreground">
                  <li>
                    Next.js dostarcza idealnych narzędzi (SSR, API Routes, RSC)
                    do integracji z modelami AI.
                  </li>
                  <li>
                    Kluczem do sukcesu jest solidna architektura, a nie tylko
                    wywołania API.
                  </li>
                  <li>
                    Rola dewelopera ewoluuje w kierunku stratega łączącego
                    biznes, design i technologię AI.
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-6 my-10 lg:hidden">
                <h3 className="font-medium text-foreground mb-3 mt-0">
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
                Framework ten dostarcza nam solidnych fundamentów do budowy
                aplikacji nowej generacji. Jego architektura, oparta na React,
                jest elastyczna i wydajna, co czyni go idealnym wyborem dla
                projektów o wysokich wymaganiach.
              </p>

              <h3 id={postData.headings[1].id}>{postData.headings[1].text}</h3>
              <ol>
                <li>
                  <strong>Server-Side Rendering (SSR) i SSG:</strong> Kluczowe
                  dla SEO i początkowej wydajności. Pozwalają serwować w pełni
                  wyrenderowany HTML, co jest przyjazne dla robotów
                  wyszukiwarek.
                </li>
                <li>
                  <strong>Route Handlers (API Routes):</strong> Upraszczają
                  bezpieczną komunikację z zewnętrznymi serwisami, w tym
                  modelami AI, chroniąc wrażliwe klucze API.
                </li>
                <li>
                  <strong>React Server Components (RSC):</strong> Idealne do
                  asynchronicznych operacji, jak zapytania do AI, bez wysyłania
                  zbędnego JavaScriptu do klienta.
                </li>
              </ol>

              <blockquote>
                „Celem nie jest dodanie AI jako funkcji. Celem jest
                wykorzystanie AI do fundamentalnego ulepszenia doświadczenia
                użytkownika.”
              </blockquote>

              <hr className="my-12" />

              <h2 id={postData.headings[2].id}>{postData.headings[2].text}</h2>
              <p>
                Integracja z AI to coś więcej niż tylko wywołanie API. To
                przemyślana architektura, która polega na łączeniu narzędzi
                takich jak{" "}
                <a
                  href="https://sdk.vercel.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vercel AI SDK
                </a>{" "}
                z jasnym celem biznesowym. Poniższa tabela przedstawia
                przykładowe zastosowania:
              </p>

              <table>
                <thead>
                  <tr>
                    <th>Funkcjonalność AI</th>
                    <th>Narzędzie Next.js</th>
                    <th>Korzyść biznesowa</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Generowanie opisów produktów</td>
                    <td>Route Handler + RSC</td>
                    <td>Automatyzacja i oszczędność czasu</td>
                  </tr>
                  <tr>
                    <td>Inteligentna wyszukiwarka</td>
                    <td>Vercel AI SDK (Embeddings)</td>
                    <td>Lepsze dopasowanie wyników</td>
                  </tr>
                  <tr>
                    <td>Chatbot wsparcia klienta</td>
                    <td>Streaming UI (RSC)</td>
                    <td>Natychmiastowa pomoc 24/7</td>
                  </tr>
                </tbody>
              </table>

              <h3 id={postData.headings[3].id}>{postData.headings[3].text}</h3>
              <Callout icon={<Info className="w-5 h-5" />}>
                <p>
                  Zawsze przechowuj klucze API w zmiennych środowiskowych
                  (`.env.local`) i nigdy nie udostępniaj ich po stronie klienta.
                  Używaj API Routes w Next.js jako bezpiecznego pośrednika.
                </p>
              </Callout>

              <CodeBlockWrapper>
                <code className="language-typescript font-mono">
                  {`// app/api/chat/route.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  // ...
}`}
                </code>
              </CodeBlockWrapper>

              <h2 id={postData.headings[4].id}>{postData.headings[4].text}</h2>
              <p>
                Rola dewelopera ewoluuje. Nie jesteśmy już tylko wykonawcami
                kodu, ale strategami, którzy łączą kropki między potrzebami
                biznesu, oczekiwaniami użytkowników a rosnącymi możliwościami
                sztucznej inteligencji.
              </p>
            </div>

            <footer className="mt-16 pt-10 border-t space-y-12">
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
                    <Link
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        shareUrl
                      )}&text=${encodeURIComponent(shareTitle)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Udostępnij na Twitterze"
                    >
                      <Twitter className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                        shareUrl
                      )}&title=${encodeURIComponent(shareTitle)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Udostępnij na LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyLink}
                    aria-label="Skopiuj link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-6 bg-muted/40 p-6 rounded-lg border">
                <Avatar className="w-20 h-20 border-2 border-primary/20">
                  <AvatarImage
                    src={postData.author.avatar}
                    alt={postData.author.name}
                  />
                  <AvatarFallback>ZP</AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Napisane przez
                  </span>
                  <h4 className="font-semibold text-xl mt-1">
                    {postData.author.name}
                  </h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    {postData.author.title}
                  </p>
                  <p className="mt-3 text-foreground/90 text-base">
                    {postData.author.bio}
                  </p>
                </div>
              </div>

              <nav className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="#"
                  className="border rounded-lg p-5 hover:border-primary transition-colors group flex flex-col justify-between"
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
                  className="border rounded-lg p-5 hover:border-primary transition-colors text-right group flex flex-col justify-between"
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
