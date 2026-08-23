import type { Metadata } from "next"
import { Hero } from "@/components/home/Hero"
import { Skills } from "@/components/home/Skills"
import { Gallery } from "@/components/home/Gallery"
import { Contact } from "@/components/home/Contact"
import { BlogPreview } from "@/components/home/BlogPreview"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zeprzalka.com"

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
  sameAs: [
    "https://github.com/m-zeprzalka",
    "https://www.facebook.com/michalzeprzalka",
  ],
}

export default function Home() {
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
