import { Hero } from "@/components/sections/Hero"
import { Skills } from "@/components/sections/Skills"
import { Gallery } from "@/components/sections/Gallery"
import { Contact } from "@/components/sections/Contact"
import { BlogE } from "@/components/alternative/BlogE"
import { BlogF } from "@/components/alternative/BlogF"
import { BlogG } from "@/components/alternative/BlogG"
import { BlogH } from "@/components/alternative/BlogH"
import { BlogI } from "@/components/alternative/BlogI"
import { BlogJ } from "@/components/alternative/BlogJ"

export default function Home() {
  return (
    <>
      <BlogJ />
      <BlogI />
      <BlogH />
      <BlogG />
      <BlogF />
      <BlogE />
      <Hero />
      <Skills />
      <Gallery />
      <Contact />
    </>
  )
}
