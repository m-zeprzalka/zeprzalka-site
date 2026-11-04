/**
 * Treść podstron: usługi, o mnie, kontakt, portfolio i blog.
 *
 * Polskie napisy są przeniesione z komponentów co do znaku — polska wersja
 * serwisu wygląda dokładnie tak samo jak przed wprowadzeniem dwujęzyczności.
 * `en` ma typ `typeof pl`, więc każdy nowy tekst musi powstać w obu językach.
 */
import "server-only"
import type { Locale } from "@/i18n/config"

const pl = {
  services: {
    badge: "Usługi",
    title: "Ile kosztuje strona internetowa?",
    description:
      "Poniżej ceny, od których zaczynamy rozmowę. Ostateczna cena zależy od zakresu — wycenę dostajesz w 24 godziny, bez zobowiązań.",
    /** Kotwice sekcji — po polsku polskie, po angielsku angielskie. */
    packagesId: "pakiety",
    packagesHeading: "Pakiety i ceny",
    recurringBadge: "Abonament",
    startBadge: "Na początek",
    priceFrom: "od",
    fixedPrice: "cena stała",
    currency: "zł",
    priceNote:
      "Ceny netto (bez VAT). Grafika, wideo i animacja — jako dodatek do projektu, wyceniane osobno. Współpraca B2B i white-label dla agencji — napisz, wyślę stawkę dzienną i CV.",
    processId: "proces",
    processHeading: "Jak wygląda współpraca",
    guaranteesId: "gwarancje",
    guaranteesHeading: "Gwarancje",
    quoteId: "wycena",
    quoteHeading: "Opisz projekt, odpowiem w 24 godziny",
    quoteBody:
      "Napisz, co chcesz osiągnąć. W ciągu dnia roboczego odpowiem z pierwszą propozycją i widełkami. Jeśli uznam, że Twojego problemu nie rozwiąże strona ani aplikacja — powiem to wprost.",
    quotePrimary: "Poproś o wycenę",
    quoteSecondary: "Kim jestem",
    quotePortfolio: "Zobacz realizacje",
    /** Nazwa katalogu ofert w danych strukturalnych. */
    offerCatalog: "Usługi cyfrowe",
  },

  about: {
    status: "Gotowy do współpracy",
    name: "Michał Zeprzałka",
    role: "Projektant i programista produktów cyfrowych",
    location: "Warszawa, Polska",
    aboutHeading: "O mnie",
    experienceHeading: "Doświadczenie",
    skillsHeading: "Umiejętności",
    educationHeading: "Edukacja",
    /** Akapit pierwszy: wyróżnienie stoi w środku zdania. */
    bioLeadPrefix: "Mam ",
    bioLeadStrong: "15 lat doświadczenia",
    bioLeadSuffix:
      " w projektowaniu i wdrażaniu innowacyjnych rozwiązań webowych i multimedialnych. Łączę umiejętności techniczne z wrażliwością projektową — tworzę produkty cyfrowe, które są funkcjonalne i estetyczne. ",
    bioSecondPrefix:
      "Specjalizuję się w projektowaniu design systemów i stron internetowych, integracjach AI oraz budowie skalowalnych aplikacji. Mam duże doświadczenie w projektowaniu graficznym, animacji i tworzeniu materiałów wideo. Przez wiele lat byłem wykładowcą akademickim, ",
    bioSecondStrong: "zdobywając Nagrodę Rektora",
    bioSecondSuffix:
      " za najwyższą średnią ocen w ankietach studenckich: 99,28%.",
    experience: [
      {
        role: "Projektant i programista produktów cyfrowych",
        company: "Freelance",
        period: "2011–obecnie",
        description:
          "Ponad 30 klientów. Głównie tworzenie stron internetowych, aplikacji, materiałów graficznych, animacji i materiałów wideo. Prowadzenie social mediów i zarządzanie nimi, przygotowywanie kampanii reklamowych oraz doradztwo w zakresie transformacji cyfrowej.",
        tags: [
          "Social media",
          "Marketing",
          "Branding",
          "Projektowanie UX/UI",
          "Tworzenie stron i aplikacji",
          "Grafika",
          "Montaż wideo",
          "Animacja",
          "Integracje AI",
        ],
      },
      {
        role: "Wykładowca akademicki",
        company: "Uczelnie wyższe",
        period: "2016–2026",
        description:
          "Prowadzenie zajęć z zakresu projektowania graficznego, tworzenia stron internetowych oraz nowoczesnych technologii. Kierownik specjalizacji Multimedia w Warszawskiej Szkole Reklamy. Wykładowca Uniwersytetu Civitas wyróżniony Nagrodą Rektora.",
        tags: [
          "Tworzenie stron WWW",
          "Projektowanie graficzne",
          "Figma",
          "Photoshop",
          "After Effects",
          "Social media marketing",
        ],
      },
    ],
    skillGroups: [
      {
        category: "Frontend",
        items: [
          "HTML/CSS",
          "JavaScript",
          "React",
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "Framer Motion",
        ],
      },
      {
        category: "Design",
        items: [
          "Figma",
          "Design systems",
          "UI/UX",
          "Typografia",
          "Adobe CC",
          "Branding",
        ],
      },
      {
        category: "Backend & Infrastruktura",
        items: [
          "WordPress",
          "Node.js",
          "PostgreSQL",
          "Vercel",
          "Docker",
          "REST API",
        ],
      },
      {
        category: "AI & Automatyzacja",
        items: ["LLM Integration", "Prompt Engineering", "n8n", "OpenAI API"],
      },
    ],
    education: [
      {
        school: "Uniwersytet Civitas",
        degree: "Studia magisterskie",
        field: "Socjologia, specjalizacja: nowe media",
        period: "2014–2017",
      },
      {
        school: "Szkoła Główna Gospodarstwa Wiejskiego",
        degree: "Studia licencjackie",
        field:
          "Socjologia i pedagogika, specjalizacja: animacja społeczna z edukacją kulturalną",
        period: "2011–2014",
      },
      {
        school: "Warszawska Szkoła Reklamy",
        degree: "Szkoła policealna",
        field: "Specjalizacja: strategia reklamy i PR",
        period: "2012–2014",
      },
    ],
    ctaContact: "Porozmawiajmy o projekcie",
    ctaCv: "Pobierz CV (PDF)",
    ctaPortfolio: "Portfolio online",
    /** Dane strukturalne: miasto i obszary kompetencji. */
    addressLocality: "Warszawa",
    knowsAbout: [
      "Web Development",
      "Next.js",
      "React",
      "UX/UI Design",
      "Branding",
      "Animacja",
      "Integracje AI",
    ],
  },

  contact: {
    badge: "Kontakt",
    title: "Porozmawiajmy",
    description:
      "Masz pomysł na projekt? Chętnie go omówię i zaproponuję rozwiązanie dopasowane do Twoich potrzeb.",
    emailLabel: "E-mail",
    locationLabel: "Lokalizacja",
    locationValue: "Polska — praca zdalna",
    responseLabel: "Czas odpowiedzi",
    responseValue: "Do 24 godzin w dni robocze",
    note: "Każde zlecenie zaczyna się od krótkiej rozmowy — bez zobowiązań, bez ukrytych kosztów.",
  },

  portfolio: {
    badge: "Portfolio",
    title: "Realizacje",
    description:
      "Komplet materiałów, które mogę pokazać publicznie — własne produkty, strony i aplikacje obok pracy przy kamerze i montażu.",
    ctaId: "wspolpraca",
    ctaHeading: "Twój projekt może być następny",
    ctaBody:
      "Opisz, co chcesz zbudować — odpowiem w 24 godziny. Jeśli szukasz punktu odniesienia dla budżetu, zacznij od cennika.",
    ctaPrimary: "Bezpłatna wycena",
    ctaSecondary: "Zobacz cennik",
    /** Nazwa zbioru w danych strukturalnych; {name} to imię i nazwisko. */
    collectionName: "Portfolio — {name}",
  },

  blog: {
    badge: "Blog",
    title: "Blog technologiczny",
    description:
      "Odkryj najnowsze trendy w AI, web developmencie, designie i technologii.",
    featuredHeading: "Wyróżnione artykuły",
    allHeading: "Wszystkie artykuły",
    /** {current} i {total} podstawia komponent paginacji. */
    pageOf: "strona {current} z {total}",
    categoriesBadge: "Blog",
    categoriesTitle: "Kategorie",
    categoriesDescription: "Przeglądaj artykuły według kategorii",
    categoryBadge: "Kategoria",
    /** {count} z odmienionym rzeczownikiem — `plural()` i `common.plurals.articles`. */
    inCategory: "{count} w tej kategorii",
    tagBadge: "Tag",
    withTag: "{count} z tym tagiem",
    breadcrumbBlog: "Blog",
    breadcrumbAria: "Ścieżka nawigacji",
    relatedHeading: "Czytaj dalej",
    paginationAria: "Strony archiwum bloga",
    previousPage: "Poprzednia",
    nextPage: "Następna",
    /** {current} podstawia się w tytule i opisie kolejnych stron listy. */
    pageTitle: "Blog — strona {current}",
    pageDescription:
      "Archiwum bloga, strona {current}: artykuły o AI, Next.js, web developmencie i designie.",
  },
}

const en: typeof pl = {
  services: {
    badge: "Services",
    title: "What does a website cost?",
    description:
      "Below are the prices we start the conversation from. The final price follows the scope — you get a quote within 24 hours, with no obligation.",
    packagesId: "packages",
    packagesHeading: "Packages and prices",
    recurringBadge: "Subscription",
    startBadge: "Start here",
    priceFrom: "from",
    fixedPrice: "fixed price",
    currency: "PLN",
    priceNote:
      "Net prices (excluding VAT). Graphics, video and motion come as add-ons to a project, priced separately. B2B contracts and white-label work for agencies — write to me and I will send my day rate and CV.",
    processId: "process",
    processHeading: "How we work together",
    guaranteesId: "guarantees",
    guaranteesHeading: "Guarantees",
    quoteId: "quote",
    quoteHeading: "Describe the project and I'll reply within 24 hours",
    quoteBody:
      "Tell me what you want to achieve. Within one working day I will reply with a first proposal and a price range. If I conclude that a website or an app will not solve your problem, I will say so plainly.",
    quotePrimary: "Request a quote",
    quoteSecondary: "Who I am",
    quotePortfolio: "See my work",
    offerCatalog: "Digital services",
  },

  about: {
    status: "Available for new projects",
    name: "Michał Zeprzałka",
    role: "Digital Product Designer & Developer",
    location: "Warsaw, Poland",
    aboutHeading: "About me",
    experienceHeading: "Experience",
    skillsHeading: "Skills",
    educationHeading: "Education",
    bioLeadPrefix: "I have ",
    bioLeadStrong: "15 years of experience",
    bioLeadSuffix:
      " designing and delivering innovative web and multimedia solutions. I pair technical skill with a designer's eye — the digital products I build are meant to work well and look right. ",
    bioSecondPrefix:
      "I specialise in design systems, websites, AI integrations and scalable applications. I have long-standing experience in graphic design, animation and video production. For many years I taught at universities, ",
    bioSecondStrong: "earning the Rector's Award",
    bioSecondSuffix:
      " for the highest average score in student surveys: 99.28%.",
    experience: [
      {
        role: "Digital Product Designer & Developer",
        company: "Freelance",
        period: "2011–present",
        description:
          "More than 30 clients. Mostly websites, applications, graphic assets, animation and video. Running and managing social media, preparing advertising campaigns and advising on digital transformation.",
        tags: [
          "Social media",
          "Marketing",
          "Branding",
          "UX/UI design",
          "Websites and applications",
          "Graphic design",
          "Video editing",
          "Animation",
          "AI integrations",
        ],
      },
      {
        role: "University lecturer",
        company: "Higher education",
        period: "2016–2026",
        description:
          "Teaching graphic design, web development and modern technology. Head of the Multimedia specialisation at the Warsaw School of Advertising. Lecturer at Civitas University, honoured with the Rector's Award.",
        tags: [
          "Web development",
          "Graphic design",
          "Figma",
          "Photoshop",
          "After Effects",
          "Social media marketing",
        ],
      },
    ],
    skillGroups: [
      {
        category: "Frontend",
        items: [
          "HTML/CSS",
          "JavaScript",
          "React",
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "Framer Motion",
        ],
      },
      {
        category: "Design",
        items: [
          "Figma",
          "Design systems",
          "UI/UX",
          "Typography",
          "Adobe CC",
          "Branding",
        ],
      },
      {
        category: "Backend & Infrastructure",
        items: [
          "WordPress",
          "Node.js",
          "PostgreSQL",
          "Vercel",
          "Docker",
          "REST API",
        ],
      },
      {
        category: "AI & Automation",
        items: ["LLM Integration", "Prompt Engineering", "n8n", "OpenAI API"],
      },
    ],
    education: [
      {
        school: "Civitas University",
        degree: "Master's degree",
        field: "Sociology, New Media specialisation",
        period: "2014–2017",
      },
      {
        school: "Warsaw University of Life Sciences (SGGW)",
        degree: "Bachelor's degree",
        field:
          "Sociology and Pedagogy, specialising in community work with cultural education",
        period: "2011–2014",
      },
      {
        school: "Warsaw School of Advertising",
        degree: "Post-secondary school",
        field: "Advertising Strategy & PR specialisation",
        period: "2012–2014",
      },
    ],
    ctaContact: "Let's talk about your project",
    ctaCv: "Download CV (PDF, in Polish)",
    ctaPortfolio: "Portfolio online",
    addressLocality: "Warsaw",
    knowsAbout: [
      "Web Development",
      "Next.js",
      "React",
      "UX/UI Design",
      "Branding",
      "Animation",
      "AI integrations",
    ],
  },

  contact: {
    badge: "Contact",
    title: "Let's talk",
    description:
      "Got an idea for a project? I'd be glad to talk it through and propose a solution shaped around what you need.",
    emailLabel: "Email",
    locationLabel: "Location",
    locationValue: "Poland — working remotely",
    responseLabel: "Response time",
    responseValue: "Within 24 hours on working days",
    note: "Every engagement starts with a short conversation — no obligation, no hidden costs.",
  },

  portfolio: {
    badge: "Portfolio",
    title: "Work",
    description:
      "Everything I am free to show publicly — websites and applications next to work behind the camera and in the edit.",
    ctaId: "work-together",
    ctaHeading: "Your project could be next",
    ctaBody:
      "Describe what you want to build — I'll reply within 24 hours. If you are looking for a reference point for the budget, start with the pricing.",
    ctaPrimary: "Free quote",
    ctaSecondary: "See the pricing",
    collectionName: "Portfolio — {name}",
  },

  blog: {
    badge: "Blog",
    title: "Technology blog",
    description:
      "The latest in AI, web development, design and technology.",
    featuredHeading: "Featured articles",
    allHeading: "All articles",
    pageOf: "page {current} of {total}",
    categoriesBadge: "Blog",
    categoriesTitle: "Categories",
    categoriesDescription: "Browse articles by category",
    categoryBadge: "Category",
    inCategory: "{count} in this category",
    tagBadge: "Tag",
    withTag: "{count} tagged this way",
    breadcrumbBlog: "Blog",
    breadcrumbAria: "Breadcrumb",
    relatedHeading: "Keep reading",
    paginationAria: "Blog archive pages",
    previousPage: "Previous",
    nextPage: "Next",
    pageTitle: "Blog — page {current}",
    pageDescription:
      "Blog archive, page {current}: articles on AI, Next.js, web development and design.",
  },
}

const pages = { pl, en } as const

export function getPages(locale: Locale) {
  return pages[locale]
}
