import type { Metadata } from "next"
import { preload } from "react-dom"
import { Hero } from "@/components/home/Hero"
import { Skills } from "@/components/home/Skills"
import { Gallery } from "@/components/home/Gallery"
import { Contact } from "@/components/home/Contact"
import { BlogPreview } from "@/components/home/BlogPreview"
import { SAME_AS, SITE_URL } from "@/lib/site"


export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Michał Zeprzałka - Digital Solutions Architect",
  url: SITE_URL,
  inLanguage: "pl-PL",
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Michał Zeprzałka",
  jobTitle: "Digital Solutions Architect",
  url: SITE_URL,
  image: `${SITE_URL}/avatar.png`,
  sameAs: SAME_AS,
}

export default function Home() {
  // Poster hero maluje się jako pierwszy duży element — niech pobiera się
  // równolegle z dokumentem, a nie dopiero po odnalezieniu w HTML.
  preload("/hero-poster.webp", { as: "image", fetchPriority: "high" })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Hero />
      <Skills />
      <Gallery />
      <BlogPreview />
      <Contact />
    </>
  )
}
