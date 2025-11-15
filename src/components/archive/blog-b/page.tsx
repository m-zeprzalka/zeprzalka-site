// Imports - tylko to co niezbędne do szkieletu
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Hash,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// ============================================================================
// KOMPONENT SZABLONU - CZYSTY JSX, ZERO LOGIKI
// ============================================================================

export default function SinglePostTemplate() {
  return (
    <main className="flex flex-col p-4 py-8 md:py-12 lg:py-16 container mx-auto max-w-3xl">
      <article>
        {/* --- NAGŁÓWEK ARTYKUŁU --- */}
        <header className="mb-12 text-center">
          <Link href="#" className="inline-block">
            <Badge
              variant="outline"
              className="mb-4 hover:bg-muted transition-colors"
            >
              Web Development
            </Badge>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Tytuł Twojego Niesamowitego Artykułu
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Krótki, chwytliwy opis, który zachęci czytelników do dalszego
            czytania i pokaże im, co zyskają.
          </p>
          <div className="flex items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-6 flex-wrap">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <time dateTime="2025-09-18">18 września 2025</time>
            </div>
            <span className="text-muted-foreground/50">·</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>8 min czytania</span>
            </div>
          </div>
        </header>

        {/* --- OBRAZEK GŁÓWNY --- */}
        <figure className="relative w-full aspect-video rounded-xl border overflow-hidden mb-12 shadow-lg">
          <Image
            src="/min.png"
            alt="Przykładowy obrazek"
            fill
            className="object-cover"
            priority
          />
        </figure>

        {/* --- TREŚĆ ARTYKUŁU (HARDCODED JSX) --- */}
        {/* Tutaj wklejasz treść. Używaj klas 'prose' dla automatycznego stylowania. */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Krok 1: Solidna Struktura</h2>
          <p>
            Każdy świetny artykuł ma solidną strukturę. To nie tylko tekst, ale
            przemyślana kompozycja elementów, które prowadzą czytelnika od
            początku do końca.
          </p>
          <ul>
            <li>
              <strong>Chwytliwy Nagłówek (H1):</strong> Musi przyciągać uwagę i
              obiecywać wartość.
            </li>
            <li>
              <strong>Wciągający Wstęp:</strong> Krótki opis, który wyjaśnia, co
              czytelnik zyska.
            </li>
          </ul>

          <h3>Krok 2: Typografia i Czytelność</h3>
          <p>
            To absolutna podstawa. Jeśli tekst jest trudny do czytania, nikt go
            nie przeczyta. Pamiętaj o kontraście i wielkości fontu.
          </p>
          <blockquote>
            <p>Dobry design jest niewidoczny.</p>
          </blockquote>

          <pre>
            <code className="language-javascript">
              {`// Przykładowy kod\nfunction greatPost() {\n  console.log("Czytelność to podstawa!");\n}`}
            </code>
          </pre>
        </div>

        {/* --- STOPKA ARTYKUŁU --- */}
        <footer className="mt-16 pt-10 border-t space-y-12">
          {/* Tagi i Udostępnianie */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <Hash className="w-5 h-5 text-muted-foreground" />
              <Link href="#">
                <Badge variant="secondary" className="hover:bg-primary/20">
                  React
                </Badge>
              </Link>
              <Link href="#">
                <Badge variant="secondary" className="hover:bg-primary/20">
                  Next.js
                </Badge>
              </Link>
              <Link href="#">
                <Badge variant="secondary" className="hover:bg-primary/20">
                  Design
                </Badge>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Udostępnij:</span>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* === SEKCJA CALL TO ACTION (CTA) === */}
          <div className="bg-muted/50 border rounded-lg p-8 text-center">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Dołącz do Innowatorów</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Otrzymuj najlepsze artykuły prosto na swoją skrzynkę.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
              <Input
                type="email"
                placeholder="Twój adres e-mail"
                className="flex-grow"
              />
              <Button type="submit">Zapisz się</Button>
            </form>
          </div>

          {/* Autor */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-card p-6 rounded-lg border">
            <Avatar className="w-20 h-20 border-2 border-primary">
              <AvatarImage
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                alt="Jan Kowalski"
              />
              <AvatarFallback>JK</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm text-muted-foreground">
                Napisane przez
              </span>
              <h4 className="font-semibold text-xl">Jan Kowalski</h4>
              <p className="text-muted-foreground text-sm mt-1">
                Full-stack developer i entuzjasta designu.
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
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Poprzedni artykuł</span>
              </div>
              <span className="font-medium text-lg line-clamp-2">
                10 Błędów w Projektowaniu Stron
              </span>
            </Link>
            <Link
              href="#"
              className="border rounded-lg p-5 hover:border-primary/50 transition-colors text-right group"
            >
              <div className="flex items-center justify-end gap-3 text-sm text-muted-foreground mb-2">
                <span>Następny artykuł</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="font-medium text-lg line-clamp-2">
                Wprowadzenie do Stanu Globalnego
              </span>
            </Link>
          </nav>

          {/* Link powrotu do bloga */}
          <div className="text-center pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Powrót do wszystkich artykułów
            </Link>
          </div>
        </footer>
      </article>
    </main>
  )
}
