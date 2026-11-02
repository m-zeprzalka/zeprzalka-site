/**
 * Polityka prywatności (obowiązek informacyjny z art. 13 RODO).
 *
 * Treść opisuje to, co serwis robi naprawdę — sprawdzone w kodzie: formularz
 * (src/app/actions/contact.ts), limit zgłoszeń po adresie IP trzymany wyłącznie
 * w pamięci (src/lib/rate-limit.ts), analityka Vercel bez ciasteczek, motyw
 * w localStorage (next-themes), filmy YouTube w trybie youtube-nocookie.
 * Zmiana któregokolwiek z tych mechanizmów wymaga aktualizacji tego pliku.
 *
 * Okres przechowywania (12 miesięcy) i dane usługodawcy to decyzje właściciela
 * — patrz docs/AUDYT-2026-11.md, sekcja 4.
 */
import type { Locale } from "@/i18n/config"

export interface LegalSection {
  heading: string
  paragraphs: readonly string[]
}

const pl = {
  title: "Polityka prywatności",
  updatedLabel: "Ostatnia aktualizacja",
  updated: "2026-11-02",
  intro:
    "Ta strona wyjaśnia, jakie dane trafiają do mnie przez serwis zeprzalka.com, w jakim celu i jakie masz prawa. Piszę ją po ludzku — bez ukrytych zgód i bez śledzenia.",
  sections: [
    {
      heading: "Kto jest administratorem danych",
      paragraphs: [
        "Administratorem danych osobowych jest Michał Zeprzałka. We wszystkich sprawach dotyczących danych możesz napisać na adres m@zeprzalka.com.",
      ],
    },
    {
      heading: "Jakie dane zbieram i po co",
      paragraphs: [
        "Formularz kontaktowy zbiera imię, adres e-mail, rodzaj projektu i treść wiadomości. Te same dane otrzymuję, gdy piszesz bezpośrednio na mój adres e-mail.",
        "Wykorzystuję je wyłącznie do odpowiedzi na wiadomość i — jeśli o to prosisz — do przygotowania wyceny lub oferty (art. 6 ust. 1 lit. b RODO). Korespondencję mogę przechowywać także w prawnie uzasadnionym interesie, jakim jest możliwość wykazania jej przebiegu (art. 6 ust. 1 lit. f RODO).",
        "Podanie danych jest dobrowolne, ale bez adresu e-mail nie będę mógł odpowiedzieć.",
      ],
    },
    {
      heading: "Jak długo przechowuję dane",
      paragraphs: [
        "Przez czas korespondencji, a jeśli nie dojdzie do współpracy — nie dłużej niż 12 miesięcy od ostatniej wiadomości. Jeżeli zaczniemy współpracę, dane potrzebne do rozliczeń przechowuję przez okres wymagany przepisami prawa, w szczególności podatkowymi.",
      ],
    },
    {
      heading: "Komu powierzam dane",
      paragraphs: [
        "Serwis działa na infrastrukturze Vercel Inc. (hosting), a wiadomości z formularza przechodzą przez serwer poczty mojego dostawcy usług e-mail. Obie firmy przetwarzają dane wyłącznie na moje zlecenie.",
        "Vercel ma siedzibę w USA; przekazanie danych odbywa się na podstawie programu EU-US Data Privacy Framework. Nie sprzedaję ani nie udostępniam danych nikomu innemu.",
      ],
    },
    {
      heading: "Statystyki odwiedzin",
      paragraphs: [
        "Korzystam z Vercel Web Analytics i Speed Insights. Narzędzia te nie używają plików cookie i nie tworzą identyfikatorów pozwalających rozpoznać konkretną osobę — widzę wyłącznie zbiorcze dane: które strony są czytane, z jakich krajów i na jakich urządzeniach, oraz jak szybko się ładują.",
      ],
    },
    {
      heading: "Pliki cookie i pamięć przeglądarki",
      paragraphs: [
        "Serwis nie zapisuje plików cookie. Wybrany przez Ciebie motyw (jasny lub ciemny) zapamiętuje pamięć przeglądarki (localStorage) wyłącznie na Twoim urządzeniu — nie trafia on do mnie.",
      ],
    },
    {
      heading: "Bezpieczeństwo i treści zewnętrzne",
      paragraphs: [
        "Aby chronić formularz przed spamem, adres IP nadawcy jest przez kilka minut używany do liczenia wysłanych wiadomości. Nie jest nigdzie zapisywany na stałe. Serwer hostingu prowadzi krótkotrwałe logi techniczne.",
        "Niektóre wpisy na blogu zawierają filmy z YouTube, osadzone w trybie ograniczonego śledzenia (youtube-nocookie.com). Po uruchomieniu filmu dane przetwarza Google na zasadach własnej polityki prywatności.",
      ],
    },
    {
      heading: "Twoje prawa",
      paragraphs: [
        "Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania i przeniesienia, a także prawo sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie. Wystarczy wiadomość na m@zeprzalka.com.",
        "Jeśli uznasz, że przetwarzam dane niezgodnie z prawem, możesz złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).",
      ],
    },
  ] satisfies LegalSection[],
}

const en: typeof pl = {
  title: "Privacy policy",
  updatedLabel: "Last updated",
  updated: "2026-11-02",
  intro:
    "This page explains what personal data reaches me through zeprzalka.com, why, and what your rights are. No hidden consents and no tracking.",
  sections: [
    {
      heading: "Who controls your data",
      paragraphs: [
        "The data controller is Michał Zeprzałka. For anything related to your data, email m@zeprzalka.com.",
      ],
    },
    {
      heading: "What I collect and why",
      paragraphs: [
        "The contact form collects your name, email address, project type and message. I receive the same data when you email me directly.",
        "I use it only to reply to your message and, if you ask for it, to prepare a quote or proposal (Art. 6(1)(b) GDPR). I may also keep the correspondence on the basis of my legitimate interest in being able to show how it went (Art. 6(1)(f) GDPR).",
        "Providing the data is voluntary, but without an email address I cannot reply.",
      ],
    },
    {
      heading: "How long I keep it",
      paragraphs: [
        "For as long as we correspond and, if we do not end up working together, no longer than 12 months after the last message. If we do work together, the data needed for invoicing is kept for as long as the law requires, tax law in particular.",
      ],
    },
    {
      heading: "Who processes it on my behalf",
      paragraphs: [
        "The site runs on Vercel Inc. infrastructure (hosting), and form messages pass through my email provider's mail server. Both process data only on my instructions.",
        "Vercel is based in the United States; data transfers rely on the EU-US Data Privacy Framework. I do not sell or share your data with anyone else.",
      ],
    },
    {
      heading: "Visitor statistics",
      paragraphs: [
        "I use Vercel Web Analytics and Speed Insights. They set no cookies and create no identifiers that could single out a person — I only see aggregate data: which pages are read, from which countries and on which devices, and how fast they load.",
      ],
    },
    {
      heading: "Cookies and browser storage",
      paragraphs: [
        "The site sets no cookies. The theme you choose (light or dark) is remembered in your browser's local storage, on your device only — it never reaches me.",
      ],
    },
    {
      heading: "Security and third-party content",
      paragraphs: [
        "To protect the form from spam, the sender's IP address is used for a few minutes to count submitted messages. It is never stored permanently. The hosting server keeps short-lived technical logs.",
        "Some blog posts embed YouTube videos in privacy-enhanced mode (youtube-nocookie.com). Once you play a video, Google processes data under its own privacy policy.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "You have the right to access, rectify, erase and port your data, to restrict its processing, and to object to processing based on legitimate interest. Just email m@zeprzalka.com.",
        "If you believe your data is processed unlawfully, you can lodge a complaint with the Polish supervisory authority, the President of the Personal Data Protection Office (UODO), ul. Stawki 2, 00-193 Warsaw, or with the authority in your country.",
      ],
    },
  ],
}

export const legal = { pl, en } as const

export function getLegal(locale: Locale) {
  return legal[locale]
}
