/**
 * Dane strukturalne podstron — jedna definicja dla widoków serwisu i nowej
 * wersji strony (`src/app/main-page`). Wcześniej każdy widok składał je sam,
 * więc druga wersja musiałaby je skopiować.
 */
import "server-only"
import {
  INTL_LOCALE,
  ROUTES,
  blogPagePath,
  categoryPath,
  postPath,
  tagPath,
  type Locale,
} from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getMeta } from "@/i18n/content/meta"
import { getPages } from "@/i18n/content/pages"
import { fill } from "@/i18n/format"
import { portfolioGroups, portfolioItems } from "@/lib/portfolio"
import type { Post, TaxonomyField, Term } from "@/lib/posts"
import {
  PERSON_ID,
  blogPostingSchema,
  blogSchema,
  breadcrumbSchema,
  graph,
  personSchema,
  webPageSchema,
} from "@/lib/schema"
import { packages, type ServicePackage } from "@/lib/services"
import { SITE_NAME, absoluteUrl } from "@/lib/site"

/** Cena w danych strukturalnych: stała (`price`) albo minimalna (`minPrice`), netto. */
function priceSpecification(pack: ServicePackage, locale: Locale) {
  return {
    "@type": pack.unit ? "UnitPriceSpecification" : "PriceSpecification",
    [pack.fixed ? "price" : "minPrice"]: pack.from,
    priceCurrency: "PLN",
    valueAddedTaxIncluded: false,
    ...(pack.unit ? { unitText: pack.unit[locale] } : {}),
  }
}

/**
 * Katalog usług. Wyszukiwarka dostaje wprost, co i za ile jest oferowane,
 * zamiast domyślać się z treści strony.
 */
export function servicesPageSchema(locale: Locale) {
  const copy = getPages(locale).services
  return graph(
    {
      // `Service` świadczona przez osobę (Person z @id), a nie `ProfessionalService`:
      // ten drugi to podtyp LocalBusiness i wymaga adresu siedziby.
      "@type": "Service",
      "@id": `${absoluteUrl(ROUTES.services[locale])}#service`,
      name: getMeta(locale).services.title,
      description: getMeta(locale).root.ogDescription,
      url: absoluteUrl(ROUTES.services[locale]),
      areaServed: "PL",
      provider: { "@id": PERSON_ID },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: copy.offerCatalog,
        itemListElement: packages.map((pack) => ({
          "@type": "Offer",
          name: pack.name[locale],
          description: pack.scope[locale],
          priceSpecification: priceSpecification(pack, locale),
        })),
      },
    },
    breadcrumbSchema(locale, [
      { name: getCommon(locale).nav.services, path: ROUTES.services[locale] },
    ])
  )
}

/**
 * Zbiór realizacji. Świadomie `CreativeWork`, a nie `VideoObject`: ten drugi
 * wymaga daty publikacji i opisu każdego materiału, a tych danych po prostu
 * nie ma — lepiej podać mniej i prawdziwie.
 */
export function portfolioPageSchema(locale: Locale) {
  const copy = getPages(locale).portfolio
  return graph(
    {
      "@type": "CollectionPage",
      inLanguage: INTL_LOCALE[locale],
      author: { "@id": PERSON_ID },
      name: fill(copy.collectionName, { name: SITE_NAME }),
      url: absoluteUrl(ROUTES.portfolio[locale]),
      about: portfolioGroups.map((group) => group.label[locale]),
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: portfolioItems.length,
        itemListElement: portfolioItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: item.title[locale],
            genre: item.category[locale],
            image: absoluteUrl(item.poster),
            creator: { "@id": PERSON_ID },
          },
        })),
      },
    },
    breadcrumbSchema(locale, [{ name: copy.title, path: ROUTES.portfolio[locale] }])
  )
}

export function profilePageSchema(locale: Locale) {
  return graph(
    {
      "@type": "ProfilePage",
      url: absoluteUrl(ROUTES.about[locale]),
      inLanguage: INTL_LOCALE[locale],
      mainEntity: { "@id": PERSON_ID },
    },
    personSchema(locale),
    breadcrumbSchema(locale, [
      { name: getPages(locale).about.aboutHeading, path: ROUTES.about[locale] },
    ])
  )
}

export function contactPageSchema(locale: Locale) {
  const meta = getMeta(locale).contact
  const path = ROUTES.contact[locale]
  return graph(
    webPageSchema(
      "ContactPage",
      locale,
      { name: meta.title, description: meta.description, path },
      { mainEntity: { "@id": PERSON_ID } }
    ),
    breadcrumbSchema(locale, [{ name: meta.title, path }])
  )
}

/** Indeks bloga i kolejne strony archiwum; `posts` — wpisy widoczne na tej stronie. */
export function blogIndexSchema(locale: Locale, current: number, posts: readonly Post[]) {
  const copy = getPages(locale).blog
  const meta = getMeta(locale).blog
  const path = blogPagePath(locale, current)
  const name = current === 1 ? meta.title : fill(copy.pageTitle, { current })
  return graph(
    blogSchema(locale, { name, description: meta.description, path }, [...posts]),
    breadcrumbSchema(locale, [
      { name: copy.breadcrumbBlog, path: ROUTES.blog[locale] },
      ...(current === 1 ? [] : [{ name, path }]),
    ])
  )
}

export function categoryIndexSchema(locale: Locale) {
  const meta = getMeta(locale).categories
  const path = ROUTES.categories[locale]
  return graph(
    webPageSchema("CollectionPage", locale, {
      name: meta.title,
      description: meta.description,
      path,
    }),
    breadcrumbSchema(locale, [
      { name: getPages(locale).blog.breadcrumbBlog, path: ROUTES.blog[locale] },
      { name: meta.title, path },
    ])
  )
}

export function taxonomySchema(locale: Locale, field: TaxonomyField, term: Term) {
  const isCategory = field === "categories"
  const meta = getMeta(locale)[isCategory ? "category" : "tag"]
  const path = isCategory ? categoryPath(locale, term.slug) : tagPath(locale, term.slug)
  const name = fill(meta.title, { name: term.label })
  return graph(
    webPageSchema("CollectionPage", locale, {
      name,
      description: fill(meta.description, { name: term.label }),
      path,
    }),
    breadcrumbSchema(locale, [
      { name: getPages(locale).blog.breadcrumbBlog, path: ROUTES.blog[locale] },
      ...(isCategory
        ? [{ name: getMeta(locale).categories.title, path: ROUTES.categories[locale] }]
        : []),
      { name, path },
    ])
  )
}

/** Wpis, okruszki (Start → Blog → wpis) i odwołanie do autora przez @id. */
export function postPageSchema(locale: Locale, post: Post) {
  return graph(
    blogPostingSchema(post),
    breadcrumbSchema(locale, [
      { name: getPages(locale).blog.breadcrumbBlog, path: ROUTES.blog[locale] },
      { name: post.frontmatter.title, path: postPath(locale, post.slug) },
    ])
  )
}
