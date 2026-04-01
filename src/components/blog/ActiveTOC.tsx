"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface Heading {
  id: string
  level: number
  text: string
}

export function ActiveTOC({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null

  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0% 0% -80% 0%" }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  return (
    <SidebarMenu>
      {headings.map((heading) => (
        <SidebarMenuItem key={heading.id}>
          <SidebarMenuButton
            asChild
            isActive={activeId === heading.id}
            size="sm"
            // h-auto + whitespace-normal: pozwala długim tytułom zawijać się w wiele linii
            className="h-auto whitespace-normal [&>*]:whitespace-normal"
            style={{ paddingLeft: `${(heading.level - 2) * 12 + 8}px` }}
          >
            <Link href={`#${heading.id}`}>{heading.text}</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
