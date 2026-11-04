/**
 * Teksty wspólne dla całego serwisu: nawigacja, stopka, formularz, komunikaty
 * błędów i drobne etykiety interfejsu.
 *
 * Drzewo `en` ma typ `typeof pl`, więc brak choćby jednego klucza zatrzymuje
 * kompilację — nie da się dodać polskiego napisu bez angielskiego odpowiednika.
 */
import "server-only"
import type { Locale } from "@/i18n/config"

const pl = {
  /** Formy rzeczowników przy liczbach — patrz `plural()` w src/i18n/format.ts. */
  plurals: {
    articles: { one: "artykuł", few: "artykuły", many: "artykułów", other: "artykułu" },
    projects: { one: "realizacja", few: "realizacje", many: "realizacji", other: "realizacji" },
  },
  /** Czas lektury — `formatReadingTime()` w src/i18n/format.ts. */
  readingTime: "{minutes} min czytania",
  nav: {
    /** Etykieta pozycji menu; adresy biorą się z ROUTES w src/i18n/config.ts. */
    home: "Start",
    services: "Usługi",
    blog: "Blog",
    about: "O mnie",
    contact: "Kontakt",
    portfolio: "Portfolio",
    mainAria: "Nawigacja główna",
    mobileAria: "Nawigacja mobilna",
    menuTitle: "Menu nawigacyjne",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
  },
  languageSwitch: {
    /** Napis na przycisku — zawsze kod języka, na który przełącza. */
    label: "EN",
    aria: "Zmień język na angielski",
  },
  footer: {
    tagline: "Projektant i programista produktów cyfrowych.",
    description: "Tworzę rozwiązania, które łączą biznes z technologią.",
    navigation: "Nawigacja",
    social: "Social",
    /** {year} podstawia się w komponencie. */
    copyright: "Michał Zeprzałka — Copyright {year}",
  },
  form: {
    honeypot: "Nie wypełniaj tego pola",
    name: "Imię",
    namePlaceholder: "Twoje imię",
    email: "E-mail",
    emailPlaceholder: "twoj@email.pl",
    projectType: "Rodzaj projektu",
    projectTypePlaceholder: "Strona internetowa / Animacja / Grafika…",
    message: "Wiadomość",
    messagePlaceholder:
      "Opisz swój projekt lub zadaj pytanie. Im więcej szczegółów, tym lepiej…",
    submit: "Wyślij wiadomość",
    submitting: "Wysyłanie…",
    privacyNote:
      "Dane z formularza wykorzystam wyłącznie do odpowiedzi na wiadomość.",
    privacyLink: "Polityka prywatności",
  },
  contactAction: {
    success: "Wiadomość wysłana. Odezwę się wkrótce!",
    nameMin: "Imię musi mieć minimum 2 znaki.",
    nameMax: "Imię może mieć maksymalnie 100 znaków.",
    emailInvalid: "Podaj poprawny adres e-mail.",
    emailMax: "Adres e-mail jest za długi.",
    projectTypeMax: "Rodzaj projektu jest za długi.",
    messageMin: "Wiadomość musi mieć minimum 5 znaków.",
    messageMax: "Wiadomość może mieć maksymalnie 5000 znaków.",
    /** {minutes} podstawia się w akcji serwerowej. */
    rateLimited:
      "Za dużo wiadomości z tego adresu. Spróbuj ponownie za {minutes} min lub napisz na m@zeprzalka.com.",
    unavailable:
      "Formularz jest chwilowo niedostępny. Napisz bezpośrednio na m@zeprzalka.com.",
    failed:
      "Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz na m@zeprzalka.com.",
  },
  ui: {
    themeToggle: "Zmień motyw",
    skipToContent: "Przejdź do treści",
    youtubePlay: "Odtwórz film (YouTube)",
    copyCode: "Kopiuj kod",
    copied: "Skopiowano",
    newTab: "otwiera się w nowej karcie",
    tableOfContents: "Spis treści",
    scrollableTable: "Tabela (przewijana w poziomie)",
    codeBlock: "Blok kodu",
    videoFallback: "Twoja przeglądarka nie obsługuje wideo.",
  },
  postCta: {
    title: "Potrzebujesz czegoś podobnego u siebie?",
    description:
      "Projektuję i wdrażam strony, aplikacje oraz integracje AI. Napisz, co chcesz zbudować — odpowiem z propozycją rozwiązania i wyceną.",
    primary: "Bezpłatna wycena",
    secondary: "Zobacz ofertę i ceny",
  },
}

const en: typeof pl = {
  plurals: {
    articles: { one: "article", few: "articles", many: "articles", other: "articles" },
    projects: { one: "project", few: "projects", many: "projects", other: "projects" },
  },
  readingTime: "{minutes} min read",
  nav: {
    home: "Home",
    services: "Services",
    blog: "Blog",
    about: "About",
    contact: "Contact",
    portfolio: "Portfolio",
    mainAria: "Main navigation",
    mobileAria: "Mobile navigation",
    menuTitle: "Navigation menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  languageSwitch: {
    label: "PL",
    aria: "Switch language to Polish",
  },
  footer: {
    tagline: "Digital Product Designer & Developer.",
    description: "I build solutions that connect business with technology.",
    navigation: "Navigation",
    social: "Social",
    copyright: "Michał Zeprzałka — Copyright {year}",
  },
  form: {
    honeypot: "Do not fill in this field",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@email.com",
    projectType: "Project type",
    projectTypePlaceholder: "Website / Animation / Graphic design…",
    message: "Message",
    messagePlaceholder:
      "Describe your project or question. The more detail, the better…",
    submit: "Send message",
    submitting: "Sending…",
    privacyNote: "I will use the details you send only to reply to your message.",
    privacyLink: "Privacy policy",
  },
  contactAction: {
    success: "Message sent. I'll get back to you shortly!",
    nameMin: "Name must be at least 2 characters.",
    nameMax: "Name can be at most 100 characters.",
    emailInvalid: "Enter a valid email address.",
    emailMax: "The email address is too long.",
    projectTypeMax: "The project type is too long.",
    messageMin: "Message must be at least 5 characters.",
    messageMax: "Message can be at most 5000 characters.",
    rateLimited:
      "Too many messages from this address. Try again in {minutes} min or email m@zeprzalka.com.",
    unavailable:
      "The form is temporarily unavailable. Please email m@zeprzalka.com directly.",
    failed:
      "The message could not be sent. Try again or email m@zeprzalka.com.",
  },
  ui: {
    themeToggle: "Toggle theme",
    skipToContent: "Skip to content",
    youtubePlay: "Play video (YouTube)",
    copyCode: "Copy code",
    copied: "Copied",
    newTab: "opens in a new tab",
    tableOfContents: "Table of contents",
    scrollableTable: "Table (scrolls horizontally)",
    codeBlock: "Code block",
    videoFallback: "Your browser does not support video.",
  },
  postCta: {
    title: "Need something like this for your business?",
    description:
      "I design and build websites, applications and AI integrations. Tell me what you want to build — you will get a proposed solution and a quote.",
    primary: "Free quote",
    secondary: "See services and pricing",
  },
}

const common = { pl, en } as const

export function getCommon(locale: Locale) {
  return common[locale]
}
