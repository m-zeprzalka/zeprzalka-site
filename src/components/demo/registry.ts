import type { Metadata } from "next"

/**
 * Piaskownica kreatywna — rejestr dem dostępnych pod `/demo`.
 *
 * Zasady (pełny opis: `src/components/demo/README.md`):
 * - serwis nigdy nie importuje niczego z `src/components/demo/**`
 *   ani z `src/app/demo/**` — zależność biegnie tylko w jedną stronę;
 * - build produkcyjny nie widzi tras piaskownicy — pliki `*.demo.tsx` są
 *   trasami tylko poza produkcją (`pageExtensions` w `next.config.ts`);
 * - zawsze `noindex`, poza mapą strony, bez analityki.
 */

export interface DemoEntry {
  slug: string
  title: string
  date: string
  /** Iteracja projektu: 3 — system „Forma” i trzy koncepcje, 5 — pięć propozycji strony głównej. */
  iteration: 3 | 5
  status: "rekomendacja" | "propozycja"
  /** Iteracja 5: zadanie od właściciela, na które propozycja odpowiada. */
  brief?: string
  summary: string
  /** Koncepcje do oceny: dla kogo działa najlepiej i czego się bać. */
  pitch?: { strengths: readonly string[]; risks: readonly string[] }
}

export const DEMOS: readonly DemoEntry[] = [
  {
    slug: "tryptyk",
    brief: "Ulepszony „Indeks”",
    title: "Tryptyk",
    date: "2026-11-04",
    iteration: 5,
    status: "propozycja",
    summary:
      "Rozwinięcie „Indeksu”. Od 1280 px trzy kolumny: spis z wyszukiwarką ⌘K, szerszy dokument i scena multimediów, do której wlatuje kliknięta realizacja — tekst nigdy się nie przelewa.",
    pitch: {
      strengths: [
        "Najwięcej rzemiosła i treści na ekranie — docenią to ludzie z branży",
        "Scena po prawej rozwiązuje przełączanie realizacji: drugie kliknięcie wygląda jak pierwsze",
        "Glif w logo pokazuje sekcję, którą czytasz; paleta ⌘K otwiera realizację w scenie",
      ],
      risks: [
        "Najcichsza z pięciu — stoi na dobrym tekście",
        "Najwięcej JavaScriptu z nowych propozycji",
      ],
    },
  },
  {
    slug: "esencja",
    brief: "Wolna interpretacja Twoich wskazówek",
    title: "Esencja",
    date: "2026-11-04",
    iteration: 5,
    status: "propozycja",
    summary:
      "Framer w czerni i bieli: litery z rozmycia, reel rosnący przy przewijaniu, nieskończony pokaz realizacji w dwóch rzędach, manifest wypełniany przewijaniem, cztery żywe kompetencje i masonry.",
    pitch: {
      strengths: [
        "Najbliżej Twojego opisu gustu — wszystkie ulubione efekty w jednym, spokojnym rytmie",
        "Kompetencje się dzieją: karta z regułą promieni, log wdrożenia, czat AI ruszający w kadrze, oś czasu animacji",
        "Wielki znak „Zeprzałka” w stopce domyka stronę",
      ],
      risks: [
        "Najwięcej ruchu — przy migracji trzeba pilnować, żeby nie zjechać w efekciarstwo",
        "Cztery mini-interfejsy to cztery małe produkty do utrzymania",
      ],
    },
  },
  {
    slug: "glif",
    brief: "Zaskocz mnie",
    title: "Glif",
    date: "2026-11-04",
    iteration: 5,
    status: "propozycja",
    summary:
      "Tożsamość z migającego znaku w logo: portret ASCII jako żywe pole glifów, realizacje jako rastrowe wydruki z glifów, które odkodowują się w kolor tam, gdzie patrzysz.",
    pitch: {
      strengths: [
        "Najmocniejsze i najbardziej zapamiętywalne pierwsze wrażenie",
        "Kolor ma uzasadnienie: strona jest czarno-biała, kolor mają tylko Twoje realizacje",
        "Jeden język graficzny spina logo, portret, nagłówki i portfolio",
      ],
      risks: [
        "Kadry realizacji ukryte w glifach do chwili spojrzenia — klient chce je widzieć od razu",
        "Canvas: płynność trzeba potwierdzić na prawdziwym telefonie",
      ],
    },
  },
  {
    slug: "reedycja",
    brief: "Wariacja obecnej strony głównej",
    title: "Reedycja",
    date: "2026-11-04",
    iteration: 5,
    status: "propozycja",
    summary:
      "Obecna strona główna w drugim wydaniu: ten sam układ i treść, ciemny motyw jako główny, system „Formy”, reel rosnący przy przewijaniu, podgląd realizacji z morfem i spłacony dług wizualny.",
    pitch: {
      strengths: [
        "Najbezpieczniejsza: rozpoznawalnie Twoja strona, tylko na poziomie seniorskim",
        "Najlżejsza i najbliższa migracji",
        "Rozwiązuje 10 z 13 pozycji długu wizualnego obecnej strony",
      ],
      risks: [
        "Najmniej zaskakuje — nie zmienia pozycjonowania strony",
        "Efekt „wow” tylko w hero i podglądzie realizacji",
      ],
    },
  },
  {
    slug: "transformacja",
    brief: "Projekt X",
    title: "Transformacja",
    date: "2026-11-04",
    iteration: 5,
    status: "propozycja",
    summary:
      "Strona wykonuje nagłówek: przewijanie zamienia szkic hero w projekt, kod (build → Ready) i gotowy produkt. Kompetencje się przeżywa, a na koniec można samemu podkręcić tokeny strony.",
    pitch: {
      strengths: [
        "Jedyna, która pokazuje projekt i kod jednym gestem — najmocniejszy argument „zatrudnij mnie”",
        "Scena na samym CSS — płynna nawet przy spowolnionym procesorze",
        "Po scenie spokojny „gotowy produkt”: portfolio z filtrem, blog, kontakt",
      ],
      risks: [
        "Pierwszy ekran to makieta — gotowe hero widać dopiero po przewinięciu",
        "Scena musi zostać krótka, inaczej męczy",
      ],
    },
  },
  {
    slug: "zywy-interfejs",
    title: "Forma · Żywy interfejs",
    date: "2026-11-03",
    iteration: 3,
    status: "rekomendacja",
    summary:
      "Miękki minimalizm Vercel/shadcn. Każda kompetencja udowadnia się działającym mini-interfejsem: inspektor projektu, log builda, odpowiedź AI strumieniem, sala wykładowa.",
    pitch: {
      strengths: [
        "Pokazuje cztery kompetencje działaniem, nie deklaracją — i rozumie to klient, który nie jest projektantem",
        "Szkielet najbliższy dzisiejszej stronie: przejście bez rewolucji w treści",
        "Nagłówek „przekształca się” pod kursorem — jeden moment wow, reszta spokojna",
      ],
      risks: [
        "Cztery mini-interfejsy to cztery małe produkty do utrzymania",
        "Najwięcej JavaScriptu z trzech koncepcji (kafle ładują się dopiero w kadrze)",
      ],
    },
  },
  {
    slug: "indeks",
    title: "Forma · Indeks",
    date: "2026-11-03",
    iteration: 3,
    status: "propozycja",
    summary:
      "Jedna precyzyjna kolumna w stylu designerów-inżynierów. Lista realizacji z kartą wideo płynącą za kursorem, chipy w tekście, paleta ⌘K.",
    pitch: {
      strengths: [
        "Najwięcej rzemiosła na piksel — docenią to projektanci i ludzie z branży",
        "Najlżejsza i najszybsza; świetnie się czyta na telefonie",
        "Paleta ⌘K i chipy w tekście nagradzają ciekawość",
      ],
      risks: [
        "Może wyglądać „za cicho” dla klienta, który szuka efektu",
        "Wymaga bardzo dobrego tekstu — forma niczego nie zasłania",
      ],
    },
  },
  {
    slug: "talia",
    title: "Forma · Talia",
    date: "2026-11-03",
    iteration: 3,
    status: "propozycja",
    summary:
      "Najpierw praca: realizacje jako talia miękkich kart z wideo — wachlarz na desktopie, stos do przesuwania palcem na telefonie, filtry tasujące karty.",
    pitch: {
      strengths: [
        "Najmocniejsze pierwsze wrażenie: prawdziwe realizacje od pierwszego ekranu",
        "Gest na telefonie (przesuwanie stosu) jak w natywnej aplikacji",
        "Karta wyjęta z talii płynnie przechodzi w podgląd — gotowy wzór pod case studies",
      ],
      risks: [
        "Stoi na materiale wizualnym: słabszy kadr psuje całość",
        "Najbliżej „zabawy” — wymaga dyscypliny, żeby nie zjechać w efekciarstwo",
      ],
    },
  },
  {
    slug: "forma",
    title: "Forma · Specimen systemu",
    date: "2026-11-03",
    iteration: 3,
    status: "propozycja",
    summary:
      "Wspólny fundament trzech koncepcji: kolory w obu motywach, pismo, promienie, cienie i prymitywy (pigułki, chipy, kopiowanie, przełącznik motywu, liczby).",
  },
]

export function demoMetadata(slug: string): Metadata {
  const demo = DEMOS.find((entry) => entry.slug === slug)
  return {
    title: demo ? demo.title : slug,
    description: demo?.summary,
  }
}
