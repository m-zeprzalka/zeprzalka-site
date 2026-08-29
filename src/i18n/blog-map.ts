/**
 * Powiązania między polskimi i angielskimi wpisami bloga.
 *
 * Angielskie wpisy mają własne, angielskie slugi — `/en/blog/css-basics`
 * zamiast `/en/blog/css`. Ta mapa jest jedynym miejscem, w którym para
 * „ten sam tekst w dwóch językach" jest zapisana; korzystają z niej
 * znaczniki `hreflang`, mapa strony i przełącznik języka.
 *
 * Plik jest czystymi danymi (bez `fs`), więc może go zaimportować także
 * komponent kliencki — przełącznik nie potrzebuje wtedy żadnych propsów.
 */
import type { Locale, Localized } from "@/i18n/config"

/** Slug wpisu w obu językach. Kolejność alfabetyczna, jak w `content/`. */
export const POST_SLUGS: readonly Localized<string>[] = [
  { pl: "aifeed", en: "aifeed" },
  { pl: "bootstrap", en: "bootstrap" },
  { pl: "claude-design", en: "claude-design" },
  { pl: "css", en: "css-basics" },
  { pl: "dashboard", en: "drone-dashboard-nextjs-ai" },
  { pl: "grafiki", en: "modern-image-formats-nextjs" },
  { pl: "html", en: "html-basics" },
  { pl: "markerkit-bazy-danych", en: "makerkit-databases" },
  { pl: "markerkit-edycja", en: "makerkit-customisation" },
  { pl: "markerkit-server-component", en: "makerkit-server-components" },
  { pl: "markerkit-wprowadzenie", en: "makerkit-installation" },
  { pl: "mdx", en: "mdx-in-nextjs" },
  { pl: "next-shadcn", en: "nextjs-shadcn-ui" },
  { pl: "od-html-do-ai", en: "landing-page-from-html-to-ai" },
  { pl: "player", en: "music-player-ui-nextjs" },
  { pl: "ppg", en: "first-banner-in-figma" },
  { pl: "promptowanie", en: "building-websites-with-ai" },
  { pl: "saas-boilerplates", en: "saas-boilerplates" },
  { pl: "social-manager-fable-5", en: "fable-5-social-manager" },
  { pl: "tailwind-netlify", en: "cv-to-website-in-60-minutes" },
  { pl: "tailwind", en: "tailwind-css-with-ai" },
  { pl: "trendy-socialmedia", en: "social-media-design-trends" },
  { pl: "twoja-pierwsza-strona", en: "your-first-responsive-page" },
  { pl: "twoja-strona-w-internecie", en: "publish-a-website-github-vercel" },
  { pl: "typescript-1", en: "js-ts-basics-variables-memory-types" },
  { pl: "wordpress", en: "wordpress-in-2025" },
  { pl: "zaliczenie", en: "project-brief-before-you-code" },
]

/**
 * Nazwy kategorii. Slug powstaje z nazwy (patrz `slugify` w lib/posts.ts),
 * więc para nazw wystarcza, żeby skojarzyć obie strony kategorii.
 */
export const CATEGORY_LABELS: readonly Localized<string>[] = [
  { pl: "Web development", en: "Web development" },
  { pl: "Web Dev", en: "Web Dev" },
  { pl: "Next.js", en: "Next.js" },
  { pl: "AI", en: "AI" },
  { pl: "SaaS", en: "SaaS" },
  { pl: "Design", en: "Design" },
  { pl: "Projekty", en: "Projects" },
  { pl: "React", en: "React" },
  { pl: "MDX", en: "MDX" },
]

/** To samo dla tagów. */
export const TAG_LABELS: readonly Localized<string>[] = [
  { pl: "Kurs", en: "Course" },
  { pl: "Next.js", en: "Next.js" },
  { pl: "Prompt Engineering", en: "Prompt Engineering" },
  { pl: "Landing Page", en: "Landing Page" },
  { pl: "Podstawy", en: "Basics" },
  { pl: "Makerkit", en: "Makerkit" },
  { pl: "HTML", en: "HTML" },
  { pl: "Tailwind CSS", en: "Tailwind CSS" },
  { pl: "Supabase", en: "Supabase" },
  { pl: "Shadcn UI", en: "Shadcn UI" },
  { pl: "Deployment", en: "Deployment" },
  { pl: "React", en: "React" },
  { pl: "Grafika", en: "Graphics" },
  { pl: "Figma", en: "Figma" },
  { pl: "CSS", en: "CSS" },
  { pl: "TypeScript", en: "TypeScript" },
  { pl: "MDX", en: "MDX" },
  { pl: "WordPress", en: "WordPress" },
  { pl: "Social Media", en: "Social Media" },
  { pl: "Blog", en: "Blog" },
]

/** Ta sama reguła slugów co w lib/posts.ts — powielona, bo tam siedzi `fs`. */
function toSlug(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "-")
}

function translate(
  pairs: readonly Localized<string>[],
  value: string,
  from: Locale,
  to: Locale,
  normalise: (input: string) => string = (input) => input
): string | null {
  const needle = normalise(value)
  const pair = pairs.find((entry) => normalise(entry[from]) === needle)
  return pair ? normalise(pair[to]) : null
}

/** Slug tego samego wpisu w drugim języku — `null`, gdy tłumaczenia nie ma. */
export function translatePostSlug(
  slug: string,
  from: Locale,
  to: Locale
): string | null {
  return translate(POST_SLUGS, slug, from, to)
}

/** Slug tej samej kategorii w drugim języku. */
export function translateCategorySlug(
  slug: string,
  from: Locale,
  to: Locale
): string | null {
  return translate(CATEGORY_LABELS, slug, from, to, toSlug)
}

/** Slug tego samego tagu w drugim języku. */
export function translateTagSlug(
  slug: string,
  from: Locale,
  to: Locale
): string | null {
  return translate(TAG_LABELS, slug, from, to, toSlug)
}
