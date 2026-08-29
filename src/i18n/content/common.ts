/**
 * Teksty wspólne dla całego serwisu: nawigacja, stopka, formularz, komunikaty
 * błędów i drobne etykiety interfejsu.
 *
 * Drzewo `en` ma typ `typeof pl`, więc brak choćby jednego klucza zatrzymuje
 * kompilację — nie da się dodać polskiego napisu bez angielskiego odpowiednika.
 */
import type { Locale } from "@/i18n/config"

const pl = {
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
    tagline: "Projektant / Strateg / Full-Stack Developer.",
    description: "Tworzę rozwiązania, które łączą biznes z technologią.",
    navigation: "Nawigacja",
    social: "Social",
    /** {year} podstawia się w komponencie. */
    copyright: "Michał Zeprzałka - Copyright {year}",
  },
  form: {
    honeypot: "Nie wypełniaj tego pola",
    name: "Imię",
    namePlaceholder: "Twoje imię",
    email: "Email",
    emailPlaceholder: "twoj@email.pl",
    projectType: "Rodzaj projektu",
    projectTypePlaceholder: "Strona internetowa / Animacja / Grafika...",
    message: "Wiadomość",
    messagePlaceholder:
      "Opisz swój projekt lub pytanie. Im więcej szczegółów, tym lepiej...",
    submit: "Wyślij wiadomość",
    submitting: "Wysyłanie...",
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
  notFound: {
    title: "Strona nie znaleziona",
    description:
      "Wygląda na to, że strona, której szukasz zadziałała tylko w wyobraźni. Przejdźmy na stabilny grunt.",
    cta: "Wróć na stronę główną",
  },
  error: {
    title: "Coś poszło nie tak!",
    description: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie lub odśwież stronę.",
    cta: "Spróbuj ponownie",
  },
  ui: {
    themeToggle: "Zmień motyw",
    copyCode: "Kopiuj kod",
    tableOfContents: "Spis treści",
    noImage: "Brak obrazka",
    /** {label} to opis materiału wideo. */
    videoPlay: "Odtwórz: {label}",
    videoPause: "Wstrzymaj: {label}",
    videoFallback: "Twoja przeglądarka nie obsługuje wideo.",
  },
  postCta: {
    title: "Potrzebujesz czegoś podobnego u siebie?",
    description:
      "Projektuję i wdrażam strony, aplikacje oraz integracje AI. Napisz, co chcesz zbudować — odpowiem z propozycją rozwiązania i wyceną.",
    primary: "Bezpłatna wycena",
    secondary: "Zobacz, czym się zajmuję",
  },
}

const en: typeof pl = {
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
    tagline: "Designer / Strategist / Full-Stack Developer.",
    description: "I build solutions that connect business with technology.",
    navigation: "Navigation",
    social: "Social",
    copyright: "Michał Zeprzałka - Copyright {year}",
  },
  form: {
    honeypot: "Do not fill in this field",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@email.com",
    projectType: "Project type",
    projectTypePlaceholder: "Website / Animation / Graphic design...",
    message: "Message",
    messagePlaceholder:
      "Describe your project or question. The more detail, the better...",
    submit: "Send message",
    submitting: "Sending...",
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
  notFound: {
    title: "Page not found",
    description:
      "Looks like the page you are after only ever worked in theory. Let's get back to solid ground.",
    cta: "Back to the home page",
  },
  error: {
    title: "Something went wrong!",
    description: "An unexpected error occurred. Try again or reload the page.",
    cta: "Try again",
  },
  ui: {
    themeToggle: "Toggle theme",
    copyCode: "Copy code",
    tableOfContents: "Table of contents",
    noImage: "No image",
    videoPlay: "Play: {label}",
    videoPause: "Pause: {label}",
    videoFallback: "Your browser does not support video.",
  },
  postCta: {
    title: "Need something like this for your business?",
    description:
      "I design and build websites, applications and AI integrations. Tell me what you want to build — you will get a proposed solution and a quote.",
    primary: "Free quote",
    secondary: "See what I do",
  },
}

export const common = { pl, en } as const

export function getCommon(locale: Locale) {
  return common[locale]
}

/** Podstawia `{klucz}` wartościami — jedyny mechanizm interpolacji w treściach. */
export function fill(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match
  )
}
